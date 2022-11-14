#! /usr/bin/bash

if ! command -v npm &> /dev/null; then
  echo "$(npm run build)" 1>&2
  exit 0
fi

echo "npm is not in your path!" 1>&2
exit 1
