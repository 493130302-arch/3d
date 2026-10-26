@echo off
chcp 65001 >nul
set "NODE_EXE=C:\Users\1\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE_EXE%" (
  echo 找不到本机 Node.js 运行环境，请联系项目维护者检查 Node.js。
  pause
  exit /b 1
)
echo 中国古代陶俑数字展馆正在启动……
"%NODE_EXE%" "%~dp0server.cjs"
pause
