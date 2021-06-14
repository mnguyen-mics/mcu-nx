#!/usr/bin/env bash
message=":white_check_mark: $1 version of ux-components is now available"

slack chat send \
  --title ":package: <${BUILD_URL:-}| New version of ux-components" \
  --text "$message" \
  --channel 'ux-components-releases' > /dev/null

  

