#!/usr/bin/env bash

source $HOME/.bashrc

./build-support/jenkins/common.sh

set -eu

VERSION="1.0.$(date +%Y%m%d)-build-${BUILD_NUMBER:-DEV}-rev-$(git rev-parse --short HEAD)"

REPOSITORY="releases"
GROUP_ID="com.mediarithmics.web"
ARTIFACT_ID="mediarithmics-computing-console"

mvn -q deploy:deploy-file \
  -DgroupId=${GROUP_ID} \
  -DartifactId=${ARTIFACT_ID} \
  -Dversion="${VERSION}" \
  -DgeneratePom=true \
  -Dpackaging=zip \
  -DrepositoryId=nexus \
  -Durl=https://sf-nexus.mediarithmics.com/repository/${REPOSITORY} \
  -Dfile=mediarithmics-computing-console.zip

echo '================================================'
echo 'Master Build'
echo 'group_id : '$GROUP_ID
echo 'artifact_id : '$ARTIFACT_ID
echo 'version : '$VERSION
echo '================================================'