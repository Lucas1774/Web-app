#!/bin/bash

cd client

if [ -d "build" ]; then
  rm -r build
fi

npm run default-build

cp -r build/* ..

rm -r build
