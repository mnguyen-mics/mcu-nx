#!/usr/bin/env bash

source $HOME/.bashrc
source $HOME/.nvm/nvm.sh

nvm use 14

set -eu

npm ci
npm run lint
npm run prettier-check
npm run build