#!/usr/bin/env bash

rm -rf build
truffle compile
npm run migrate
node ./gas-estimate