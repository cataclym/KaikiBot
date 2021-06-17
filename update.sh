#! /usr/bin/bash
if ! git diff-index --quiet HEAD --; then
    git checkout origin/master package-lock.json
fi
