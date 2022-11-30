#!/usr/bin/env bash
message=":package: $1 version of ux-components is now available"

slack chat send \
  --title ":white_check_mark: <https://sf-jenkins.mediarithmics.com/job/ux-components-publish/changes | New version of ux-components>" \
  --text "$message" \
  --channel 'ux-components-releases' > /dev/null

  

