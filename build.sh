#!/bin/bash
cp -f README.md client/src/assets/about
if [ -d "static" ]; then
  rm -r static
fi
cd client
if [ -d "build" ]; then
  rm -r build
fi
npm run default-build
cp -r build/* ..
rm -r build
