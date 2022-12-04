#! /usr/bin/bash

if command -v npm &> /dev/null; then
  npm ci 1>&2 && sleep 2;
  wait
  exit 0
fi

echo "npm is not in your path!" 1>&2
exit 1
