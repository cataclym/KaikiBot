#! /usr/bin/bash

if command -v npm &> /dev/null; then
  npm ci && exit 0 || exit 1;
fi

echo "npm is not in your path!" 1>&2
exit 1
