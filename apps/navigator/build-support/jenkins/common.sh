#!/usr/bin/env bash

source $HOME/.bashrc
source $HOME/.nvm/nvm.sh

nvm use 18

set -eu

npm ci --legacy-peer-deps
npm run lint
npm run prettier-check
npm run build