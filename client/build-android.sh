#!/bin/bash
if [ "$#" -eq 1 ]; then
    APP_NAME="$1"
    BUILD_ARG=""
elif [ "$#" -eq 2 ] && [ "$2" == "--release" ]; then
    APP_NAME="$1"
    BUILD_ARG="--release"
else
    echo "Invalid arguments"
    exit 1
fi

echo "App Name: $APP_NAME"
echo "Build Argument: $BUILD_ARG"
npm run build
cd cordova_env
if [ -n "$APP_NAME" ]; then
    sed -i "s/<name>.*<\/name>/<name>$APP_NAME<\/name>/g" config.xml
    sed -i "s/<widget id=\"com\.lbenito\..*\"/<widget id=\"com.lbenito.$APP_NAME\"/g" config.xml
fi
npx cordova platform rm android
npx cordova platform add android
rm -r platforms/android/app/src/main/res/mipmap-*
cp -r ../public/android_icons/* platforms/android/app/src/main/res/
rm -r www/*
cp -r ../build/* www/
npx cordova build android $BUILD_ARG
echo "Press any key to exit."
read -n 1
