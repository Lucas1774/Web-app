@echo off

if "%1"=="ELEV" (goto run) else (powershell start -verb runas '%0' ELEV & exit /b)

:run

cd "%~dp0"

netsh advfirewall set privateprofile state off

git switch main

cd server
start /b cmd /c "mvnw spring-boot:run"
cd ..

cd client
start /b cmd /c "npm start"
cd ..

echo Press any key to exit.

pause >nul
netsh advfirewall set privateprofile state on

taskkill /f /t /im java.exe
taskkill /f /t /im node.exe
