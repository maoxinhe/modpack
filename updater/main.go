// 梦之韵模组自动更新器
//
// 使用方法：把编译出的 mod-updater.exe 放进启动器的 mods 文件夹，双击运行即可。
// 程序会自动：
//   1. 查询 GitHub Releases 最新版本（默认仓库 maoxinhe/modpack）
//   2. 对比本地 .modpack_version 标记
//   3. 有新版则下载最新 ZIP 并解压到 mods 文件夹（覆盖同名 .jar）
//
// 可选配置：在 exe 同目录放 updater.json 可覆盖仓库/自定义服务端
//   {"owner":"maoxinhe","repo":"modpack","api_base":""}
// 可选参数：-check 仅检查版本；-force 强制重新下载；-url <地址> 使用自定义服务端 API
package main

import (
	"archive/zip"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// 可通过 -ldflags 在编译时覆盖默认仓库
var (
	defaultOwner = "maoxinhe"
	defaultRepo  = "modpack"
	appVersion   = "1.0.0"
)

type Config struct {
	Owner   string `json:"owner"`
	Repo    string `json:"repo"`
	ApiBase string `json:"api_base"`
}

type Asset struct {
	Name               string `json:"name"`
	BrowserDownloadURL string `json:"browser_download_url"`
	Size               int64  `json:"size"`
}

type Release struct {
	TagName     string  `json:"tag_name"`
	Name        string  `json:"name"`
	PublishedAt string  `json:"published_at"`
	Body        string  `json:"body"`
	Assets      []Asset `json:"assets"`
}

type LatestResp struct {
	Release *Release `json:"release"`
}

func formatSize(n int64) string {
	if n < 1024 {
		return fmt.Sprintf("%d B", n)
	}
	if n < 1024*1024 {
		return fmt.Sprintf("%.1f KB", float64(n)/1024)
	}
	return fmt.Sprintf("%.2f MB", float64(n)/1024/1024)
}

func loadConfig(dir string) Config {
	cfg := Config{Owner: defaultOwner, Repo: defaultRepo}
	b, err := os.ReadFile(filepath.Join(dir, "updater.json"))
	if err != nil {
		return cfg
	}
	if err := json.Unmarshal(b, &cfg); err == nil {
		if cfg.Owner == "" {
			cfg.Owner = defaultOwner
		}
		if cfg.Repo == "" {
			cfg.Repo = defaultRepo
		}
	}
	return cfg
}

func fetchFromGitHub(owner, repo string) (*Release, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/releases/latest", owner, repo)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "mod-updater/"+appVersion)
	client := &http.Client{Timeout: 15 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode == 404 {
		return nil, nil
	}
	if res.StatusCode != 200 {
		return nil, fmt.Errorf("查询 GitHub 失败 HTTP %d", res.StatusCode)
	}
	var rel Release
	if err := json.NewDecoder(res.Body).Decode(&rel); err != nil {
		return nil, err
	}
	return &rel, nil
}

func fetchFromServer(base string) (*Release, error) {
	res, err := (&http.Client{Timeout: 15 * time.Second}).Get(strings.TrimRight(base, "/") + "/api/releases/latest")
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		return nil, fmt.Errorf("查询服务端失败 HTTP %d", res.StatusCode)
	}
	var lr LatestResp
	if err := json.NewDecoder(res.Body).Decode(&lr); err != nil {
		return nil, err
	}
	return lr.Release, nil
}

func findZip(rel *Release) *Asset {
	for i := range rel.Assets {
		if strings.HasSuffix(strings.ToLower(rel.Assets[i].Name), ".zip") {
			return &rel.Assets[i]
		}
	}
	return nil
}

func download(url, dest string) error {
	client := &http.Client{Timeout: 10 * time.Minute}
	res, err := client.Get(url)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		return fmt.Errorf("下载失败 HTTP %d", res.StatusCode)
	}
	out, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer out.Close()
	_, err = io.Copy(out, res.Body)
	return err
}

func extractZip(zipPath, destDir string) (int, error) {
	r, err := zip.OpenReader(zipPath)
	if err != nil {
		return 0, err
	}
	defer r.Close()

	base := filepath.Clean(destDir) + string(os.PathSeparator)
	count := 0
	for _, f := range r.File {
		clean := filepath.Join(destDir, f.Name)
		if clean != filepath.Clean(destDir) && !strings.HasPrefix(clean, base) {
			continue // 防止路径穿越
		}
		if f.FileInfo().IsDir() {
			if err := os.MkdirAll(clean, 0755); err != nil {
				return count, err
			}
			continue
		}
		if err := os.MkdirAll(filepath.Dir(clean), 0755); err != nil {
			return count, err
		}
		rc, err := f.Open()
		if err != nil {
			return count, err
		}
		out, err := os.Create(clean)
		if err != nil {
			rc.Close()
			return count, err
		}
		_, err = io.Copy(out, rc)
		rc.Close()
		out.Close()
		if err != nil {
			return count, err
		}
		count++
	}
	return count, nil
}

func readMarker(dir string) string {
	b, err := os.ReadFile(filepath.Join(dir, ".modpack_version"))
	if err != nil {
		return ""
	}
	return strings.TrimSpace(string(b))
}

func writeMarker(dir, tag string) {
	_ = os.WriteFile(filepath.Join(dir, ".modpack_version"), []byte(tag), 0644)
}

func run() error {
	checkOnly := flag.Bool("check", false, "仅检查是否有新版本")
	force := flag.Bool("force", false, "强制重新下载并解压")
	apiBase := flag.String("url", "", "使用自定义服务端 API（可选）")
	flag.Parse()

	exePath, err := os.Executable()
	if err != nil {
		return err
	}
	dir := filepath.Dir(exePath)
	cfg := loadConfig(dir)

	var rel *Release
	if *apiBase != "" {
		rel, err = fetchFromServer(*apiBase)
	} else if cfg.ApiBase != "" {
		rel, err = fetchFromServer(cfg.ApiBase)
	} else {
		rel, err = fetchFromGitHub(cfg.Owner, cfg.Repo)
	}
	if err != nil {
		return err
	}
	if rel == nil {
		return fmt.Errorf("仓库 %s/%s 还没有发布任何版本", cfg.Owner, cfg.Repo)
	}
	asset := findZip(rel)
	if asset == nil {
		return fmt.Errorf("最新版本 %s 中没有找到 ZIP 压缩包", rel.TagName)
	}

	if *checkOnly {
		fmt.Println("========================================")
		fmt.Printf("最新版本  : %s\n", rel.TagName)
		fmt.Printf("压缩包    : %s (%s)\n", asset.Name, formatSize(asset.Size))
		fmt.Printf("下载直链  : %s\n", asset.BrowserDownloadURL)
		fmt.Println("========================================")
		return nil
	}

	current := readMarker(dir)
	if current == rel.TagName && !*force {
		fmt.Printf("已经是最新版本 %s，无需更新。\n", rel.TagName)
		return nil
	}

	fmt.Println("========================================")
	fmt.Printf("当前版本  : %s\n", orDash(current))
	fmt.Printf("最新版本  : %s\n", rel.TagName)
	fmt.Printf("开始下载  : %s (%s)\n", asset.Name, formatSize(asset.Size))
	fmt.Println("========================================")

	tmp := filepath.Join(os.TempDir(), fmt.Sprintf("modpack-%d.zip", time.Now().UnixNano()))
	defer os.Remove(tmp)
	if err := download(asset.BrowserDownloadURL, tmp); err != nil {
		return err
	}
	count, err := extractZip(tmp, dir)
	if err != nil {
		return err
	}
	writeMarker(dir, rel.TagName)
	fmt.Printf("✅ 更新完成：已解压 %d 个文件到模组文件夹\n", count)
	fmt.Printf("   当前版本：%s（%s）\n", rel.TagName, rel.Name)
	return nil
}

func orDash(s string) string {
	if s == "" {
		return "（未记录，首次更新）"
	}
	return s
}

func pause() {
	fmt.Println()
	fmt.Println("按回车键退出...")
	var b [1]byte
	_, _ = os.Stdin.Read(b[:])
}

func main() {
	fmt.Printf("🎮 梦之韵模组自动更新器 v%s\n", appVersion)
	if err := run(); err != nil {
		fmt.Printf("❌ 更新失败：%v\n", err)
		pause()
		os.Exit(1)
	}
	pause()
}
