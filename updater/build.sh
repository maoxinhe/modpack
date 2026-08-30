#!/usr/bin/env bash
# 交叉编译 Windows 版更新器（在 Linux/macOS 上运行）
set -e
cd "$(dirname "$0")"

echo ">> 编译 Windows amd64 版..."
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -ldflags "-s -w" -o mod-updater.exe .

echo ">> 编译 Linux 版（用于测试）..."
CGO_ENABLED=0 go build -ldflags "-s -w" -o mod-updater .

echo ">> 完成：updater/mod-updater.exe"
ls -lh mod-updater.exe mod-updater
