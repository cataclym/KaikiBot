#!/bin/bash
if ! [ -f .env ]; then
    echo "Missing .env file. Please double-check the guide! (https://gitlab.com/cataclym/KaikiDeishuBot/-/blob/master/GUIDE.md)"
    exit 1
fi
