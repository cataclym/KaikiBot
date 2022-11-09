#! /usr/bin/bash
echo "This is a placeholder. Updates will be implemented in v4.1+"
currentTag=$(git describe)

latestTag=$(git tag | tail -1 )

if [ "$latestTag" != "$currentTag" ]; then
  echo "New version detected. Updating from ${currentTag} to ${latestTag}..."
  git checkout "$latestTag"
  if [ "$latestTag" == "$currentTag" ]; then
    echo "Successfully updated to ${latestTag}!"
  else
    echo "Error, unable to update..."
  fi
fi

echo "No update available."
