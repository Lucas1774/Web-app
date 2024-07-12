#!/bin/bash
sed -i 's/active: .*/active: prod/' src/main/resources/application.yml
./mvnw.cmd clean package
mv -f target/server-0.0.1-SNAPSHOT.jar server.jar
sed -i 's/active: .*/active: dev/' src/main/resources/application.yml
echo "Press any key to exit."
read -n 1