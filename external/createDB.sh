#!/bin/bash
Environment=.env

if [ -f $Environment ]; then
    # Load Environment Variables
    . "$PWD/.env"
    mysql --user="$MYSQL_USER" --password="$MYSQL_PASS" --execute="\. ${PWD}/data/tableQueries.sql"

else
    echo "Missing .env file. Please double-check the guide! (https://gitlab.com/cataclym/KaikiDeishuBot/-/blob/master/GUIDE.md)"
    exit 1
fi

