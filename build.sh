#!/bin/bash

cd client

if [ -d "build" ]; then
  rm -r build
fi

npm run build

mv build/* ..

rm -r build
