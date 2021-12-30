#!/bin/bash
Environment=.env

if [ -f $Environment ]; then
    # Load Environment Variables
    export $(cat $Environment | grep -v '#' | awk '/=/ {print $1}')
    # For instance, will be example_kaggle_key
    mysql --user="$MYSQL_USER" --password="$MYSQL_PASS" --execute="CREATE DATABASE IF NOT EXISTS kaikidb"

else
    echo "Missing .env file. Please double-check the guide!"
    exit 1
fi

