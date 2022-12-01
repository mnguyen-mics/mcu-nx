#!/usr/bin/env bash

source $HOME/.bashrc

set -eu

# Gitlint

echo "Running gitlint"
git_range="origin/${ghprbTargetBranch:-staging}..${ghprbActualCommit:-HEAD}"
gitlint --commits "$git_range"

# Actual build

./build-support/jenkins/common.sh

# Publish

NEW_VERSION_NUM=`npm version $NEW_VERSION`
npm publish

# Push to staging

echo "Commit changes to package.json and package-lock.json"
git fetch origin
git checkout -B temporary
git add package-lock.json
git add package.json
git commit -m "MICS-VERSION bump version to $NEW_VERSION_NUM" \
-m "" \
-m "Commit made by Jenkins job advanced-components-publish-v1" \
-m "bump version to $NEW_VERSION_NUM"
git rebase origin/staging

echo "Pushing new version to staging..."
git checkout staging
git pull origin staging
git merge --ff-only temporary
git tag $NEW_VERSION_NUM
git push origin staging --tags