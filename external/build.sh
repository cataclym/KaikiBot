#! /usr/bin/bash

if [ "$(hash npm)" ]; then
  echo "$(npm run build)" 1>&2
  exit 0
fi

echo "npm is not in your path!" 1>&2
exit 1
