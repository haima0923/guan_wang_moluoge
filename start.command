#!/bin/zsh
cd "$(dirname "$0")"
if command -v node >/dev/null 2>&1; then
  BARSAN_NODE="$(command -v node)"
elif [ -x /Users/zhenxiansheng/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ]; then
  BARSAN_NODE=/Users/zhenxiansheng/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
else
  echo '请先安装 Node.js 24 或更新版本。'
  read
  exit 1
fi
exec "$BARSAN_NODE" server.mjs
