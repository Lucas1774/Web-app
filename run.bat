@echo off

if "%1"=="ELEV" (goto run) else (powershell start -verb runas '%0' ELEV & exit /b)

:run

cd /d "%~dp0"

netsh advfirewall set privateprofile state off

git switch main

start /B /k cmd /c "cd server && mvnw spring-boot:run"

start /B /k cmd /c "cd client && npm start"

echo Press any key to exit.


pause >nul

taskkill /f /im java.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
netsh advfirewall set privateprofile state on
