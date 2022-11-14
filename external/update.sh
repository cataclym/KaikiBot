#! /usr/bin/bash
currentTag=$(git describe)
latestTag=$(git tag | tail -1 )

if [[ "$latestTag" != "$currentTag" ]]; then
  echo "New version detected. Updating from ${currentTag} to ${latestTag}..."
  git checkout "$latestTag" && currentTag=$(git describe)

  if [[ "$latestTag" == "$currentTag" ]]; then
    echo "Successfully updated to ${latestTag}!" 1>&2
    exit 0
  else
    echo "Error, unable to update..." 1>&2
    exit 1
  fi
fi

echo "No update available." 1>&2
exit 1
