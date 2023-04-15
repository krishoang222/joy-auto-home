@echo off
call var.bat
:: -------------- EXECUTE CODE --------------
%PATH_NIRCMD% win settopmost title "launch_spotify-clone-project" 1
%PATH_NIRCMD% sendkeypress rwin+home
::minize all windows

echo. & echo Open VSCode
code %PATH_CODEFOLDER_SPOTIFY% | exit
timeout /T 3

echo. & echo Play "video tutorial"
start "" %PATH_CODEFOLDER_SPOTIFY%
timeout /T 2
