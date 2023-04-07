@echo off

REM Elevate permissions to run as administrator
if "%1"=="ELEV" (goto run) else (powershell start -verb runas '%0' ELEV & exit /b)

:run

REM Get the current directory of the script
set "SCRIPT_DIR=%~dp0"

REM Disable the Windows firewall for private networks
netsh advfirewall set privateprofile state off

REM Switch to the main branch in Git
cd /d "%SCRIPT_DIR%..\"
git switch main

REM Start the server
cd /d "%SCRIPT_DIR%..\server"
start "" /B cmd /C "mvnw.cmd spring-boot:run && exit"

REM Start the client
cd /d "%SCRIPT_DIR%..\client"
start "" /B cmd /C "npm start && exit"

REM Monitor running processes for the server and client, and enable the Windows firewall when they are closed
:monitor_processes
tasklist | find /i "java.exe" >nul 2>&1
if %errorlevel% equ 0 (
  tasklist | find /i "node.exe" >nul 2>&1
  if %errorlevel% equ 0 (
    timeout /t 5 /nobreak >nul
    goto monitor_processes
  )
)
netsh advfirewall set privateprofile state on
PAUSE