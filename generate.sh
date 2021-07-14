#!/usr/bin/env bash

usage() {
  echo '用法：generate.sh [参数] [...节次信息文件]

参数：
  -f, --force[=分钟]    添加绕过自测脚本，自测需要在指定分钟内完成，默认十分钟
  -?, -h, --help        打印帮助并退出

例子：
  generate.sh -f=5 section-times/台州职业技术学院.json'
}

i=2
case "$1" in
'-?'|'-h'|'--help')
  usage
  exit
  ;;
'-f'*|'--force'*)
  force="${1#*=}"
  if [ -z "$force" ]; then
    force=10
  else
    # shellcheck disable=SC2003
    if ! expr "$force" + 6 &> /dev/nll; then
      echo "错误参数：$1"
      exit 1
    fi
  fi
  time=$(date +%s)
  let force=$(time + force * 60) * 1000
  ;;
*)
  i=1
esac

dir="$(dirname "$0")"
out_dir="$dir/out"

# path
core() {
  if [ -z "$1" ]; then
    if [ -z "$force" ]; then
      exit
    fi
    name="force"
  else
    name="$(basename "$1")"
    name="${name%.*}"
    if [ -n "$force" ]; then
      name="$name-force"
    fi
  fi
  out_parser="$out_dir/$name-scheduleHtmlParser.js"
  cp "$dir/scheduleHtmlParser.js" "$out_parser"
  if [ -n "$1" ]; then # merge

  fi
}

#if [ i -gt $# ]; then
#
#else
#  for ((; i <= $#; ++i )); do
#    name="$(basename "${!i}")"
#    name="${name%.*}"
#  done
#fi
