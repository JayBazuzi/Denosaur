@setlocal
@if not defined _ECHO echo off
REM Copyright 2024 Jay Bazuzi. All rights reserved. MIT license.

set "DENO_VERSION_FILE=%~dp0.deno_version"
if exist %DENO_VERSION_FILE% (
    set /p DENO_VERSION=<%DENO_VERSION_FILE%
) else (
    call :ERROR .deno_version file not found.
    exit /b 1
)

set "DENO_INSTALL=%LOCALAPPDATA%\denow\deno\%DENO_VERSION%"
set "BIN_DIR=%DENO_INSTALL%\bin"
set "EXE=%BIN_DIR%\deno.exe"

call :ENSURE_HAVE_EXE
if ERRORLEVEL 1 exit /b %ERRORLEVEL%

call %EXE% %*
exit /b %ERRORLEVEL%

rem ----------------------------------------------------------------------
    :ERROR
echo %~nx0: Error: %* 1>&2
goto :EOF

rem ----------------------------------------------------------------------
    :ENSURE_HAVE_EXE
if exist "%EXE%" exit /b 0

if not exist "%BIN_DIR%" mkdir "%BIN_DIR%"

set "DENO_URI=https://github.com/denoland/deno/releases/download/%DENO_VERSION%/deno-x86_64-pc-windows-msvc.zip"
call %SystemRoot%\System32\curl.exe --fail --location --silent --output "%EXE%.zip" "%DENO_URI%"
if ERRORLEVEL 1 (
    call :ERROR failed to download %DENO_URI%
    exit /b 1
)
call %SystemRoot%\System32\tar.exe -xf "%EXE%.zip" -C "%BIN_DIR%"
if ERRORLEVEL 1 (
    call :ERROR failed to extract %EXE%.zip
    exit /b 1
)
del /s/q "%EXE%.zip" >nul 2>&1
goto :EOF
