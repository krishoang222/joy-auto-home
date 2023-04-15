@echo off
call var.bat
:: -------------- EXECUTE CODE --------------

%PATH_NIRCMD% win settopmost title "launch" 1
%PATH_NIRCMD% sendkeypress rwin+home

::minize all windows

:: 2. VS code
:: Window title of VS: <tabname> - <folder> - Visual Code
tasklist /v /fi "IMAGENAME eq code.exe" | find /I "mern-tutorial">NUL
if %errorlevel%==1 (
	echo. & echo open VSCode
	code %PATH_CODEFOLDER_JS% | exit
	:: exit here is a must: without it, will block the code
	timeout /T 2
	:: click one time to prevent "nhấp nháy vàng, ngăn taskbar thụt lại"
	:: need specify detail "-  Visual Studio Code" to not conflict with other window (video, note,...)
	)
	
:: 3. Obsidian
tasklist /v /fi "IMAGENAME eq obsidian.exe" | find /I "vault-1">NUL 
if %errorlevel%==1 (
	echo. & echo open Obsidian
	start "" %PATH_OBSIDIAN% | exit
	timeout /T 2
	)
	
:: 5. Freedom.to
tasklist /fi "IMAGENAME eq FreedomBlocker.exe" | find /I "FreedomBlocker.exe">NUL
if %errorlevel%==1 (
	echo. & echo open Freedom.to
	start "" %PATH_FREEDOM%
	timeout /T 2
	)
	
:: 6. PomodoneApp
echo. & echo open PomodoneApp
start "" %PATH_POMODONEAPP%
timeout /T 3

:: 8. Dashboard progress (Excel)
echo. & echo open Excel
start "" %PATH_SHEET%
timeout /T 3

:: 7. Video tutorial (VLC, not Youtube)
:: (VLC has option, run one instance - not create duplicate) 
:: -use because: (assume) đôi khi vlc lần trước close chưa kịp, nó sẽ bypass và k mở video
echo. & echo Play "video tutorial"
start "" %PATH_VIDEOCOURSE_JS%
timeout /T 3


exit



:: -------------- COMMENT ALL LINES ABOVE + UNCOMMENT 2 BELOW -- TO SEE HOW IT WORK IN DETAIL --------------
::tasklist /v /fi "IMAGENAME eq obsidian.exe" /fo csv | find /I "Vault-1" || echo Obsidian Vault-1 not runnning & timeout /T 2
::pause

:: -------------- DESCRIBE HOW CODE WORK --------------
:: tasklist
:: -- /v: display all (include Title) --> later, "find" will look up in there
:: -- /fi: search based on filter (lookup example on Microsoft homepage)
:: -- IMAGENAME: based on name of execute file (*.exe)
:: -- eq: "equal"
:: -- (additional) /fo csv: print result as draw, for me to understand how "find" work

:: find 
:: (character | to continue run based on previous command) -- i assume "find" treat result from "tasklist" like an .txt file, and do search character all fields
:: -- (?) don't know understand the value it return 
:: -- /I: ignore capitalization
:: >NUL: not result searching print to cmd

:: symbol
:: -- | (single pipeline): pass return to next command
:: -- &&: run command if true 
:: -- ||: run command if false (programm not running)

:: KNOWN ISSUE
:: -- use (/v + find) to display all detail: because i don't know how to use regex in /fi
:: (fixed with "| exit") Obsidan is strange: cmd window stuck with it- close cmd will close Obsidian

:: -------------- (IDEA) CAN UPDATE --------------
:: 1. loop searching just one time
:: -- use multiple '/fi' in tasklist + output result in .txt file 
:: -- loop through .txt to open programm
:: 2. store <filename> <filepath> in variable for easily customize
:: (added) 3. add 2 more app 
:: 4. display specific sheet to show what I've done, and what next - to know what to do now

:: -------------- ARCHIVE SOFTWARE --------------
:: (TODO) shortcut run 
:: if set relative to folder it placed: can't pin to taskbar or create shortcut elsewhere
:: if set fixed path: will start as /system32, couldn't find dependencies (e.g. var.bat)