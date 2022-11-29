#!/usr/bin/env bash

set -eu

# Gitlint

echo "Running gitlint"
git_range="origin/${ghprbTargetBranch:-master}..${ghprbActualCommit:-HEAD}"

echo "Running gitlint on ${git_range} (\
$(git rev-parse --short origin/${ghprbTargetBranch:-master})..$(git rev-parse --short ${ghprbActualCommit:-HEAD}) \
contains $(git rev-list --no-merges "$git_range"|wc -l) commits)"

gitlint --commits "$git_range"

# Actual build

rm -rf ./node_modules
rm -rf ./lib
./build-support/jenkins/common.sh