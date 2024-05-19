if [ "$#" -eq 0 ]; then
    BUILD_ARG=""
elif [ "$#" -eq 1 ] && [ "$1" == "--release" ]; then
    BUILD_ARG="--release"
else
    echo "Invalid arguments"
    exit 1
fi

npm run build
cd cordova_env
rm -r www/*
cp -r ../build/* www/
npx cordova build android $BUILD_ARG
echo "Press any key to exit."
read -n 1
