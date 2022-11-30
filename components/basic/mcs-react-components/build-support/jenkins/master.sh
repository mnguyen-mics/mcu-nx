#!/usr/bin/env bash

set -eu

# Actual build

cd mcs-react-components
rm -rf ./node_modules
rm -rf ./lib
./build-support/jenkins/common.sh

rm -rf dist
npm run cosmos:export
cd cosmos-export
zip ../cosmos-export.zip *
cd ..

# Publish artifact

VERSION=$1
GROUP_ID="com.mediarithmics.web"
ARTIFACT_ID="ux-components-website"
REPOSITORY="releases"

mvn -X -q deploy:deploy-file \
  -DgroupId=${GROUP_ID} \
  -DartifactId=${ARTIFACT_ID} \
  -Dversion="${VERSION}" \
  -DgeneratePom=true \
  -Dpackaging=zip \
  -DrepositoryId=nexus \
  -Durl=https://sf-nexus.mediarithmics.com/repository/${REPOSITORY} \
  -Dfile=cosmos-export.zip

echo '================================================'
echo 'Master Build'
echo 'group_id : '$GROUP_ID
echo 'artifact_id : '$ARTIFACT_ID
echo 'version : '$VERSION
echo '================================================'