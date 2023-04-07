@echo off

if "%1"=="ELEV" (goto run) else (powershell start -verb runas '%0' ELEV & exit /b)

:run

cd "%~dp0"

netsh advfirewall set privateprofile state off

git switch main

cd server
start /b cmd /c "mvnw spring-boot:run > server.log 2>&1"
cd ..

cd client
start /b cmd /c "npm start > client.log 2>&1"
cd ..

echo Press any key to exit.

pause >nul
netsh advfirewall set privateprofile state on

taskkill /f /t /im java.exe >nul 2>&1
taskkill /f /t /im node.exe >nul 2>&1
