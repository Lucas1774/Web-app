@echo off
if "%1"=="ELEV" (goto run) else (powershell start -verb runas '%0' ELEV & exit /b)

:run
cd "%~dp0"
netsh advfirewall set privateprofile state off
git switch master

set JAVA_HOME=C:\Program Files\Java\jdk-21
powershell -Command "(Get-Content server\src\main\resources\application.yml -Raw) -replace 'active: .*', 'active: dev' | Set-Content server\src\main\resources\application.yml -NoNewline"
start /B cmd.exe /c "cd server && mvnw spring-boot:run" >nul 2>&1
start /B cmd.exe /c "cd client && npm start" >nul 2>&1

echo Press any key to exit.
pause >nul
netsh advfirewall set privateprofile state on
taskkill /f /t /im java.exe > nul 2>&1
taskkill /f /t /im node.exe > nul 2>&1
