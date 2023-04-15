Set WshShell = WScript.CreateObject("WScript.Shell")

CreateObject("WScript.Shell").Run("spotify:user:spotify:playlist:6hdAmeVk15lP6EmTc5vXvG")
WScript.sleep 3000
WshShell.SendKeys "{tab}"
WScript.sleep 500
WshShell.SendKeys "{tab}"
WScript.sleep 500
WshShell.SendKeys "{enter}"

' WScript.sleep 3000
'(2) click Play button of Playlist
' WshShell.SendKeys " " 'Spacebar to play current (if not melody fun, we can change)-to prevent unexpected behaviour when Tabs work wrong

'WScript.sleep 100
'WshShell.SendKeys "{tab}"
'WScript.sleep 100
'(3) close window
'WshShell.SendKeys "% " 'Alt + Spacebar
'WScript.sleep 200
'WshShell.SendKeys "c"


' it open Spotify --> Open playlist id's link --> Navigate with keyboard to click Play
' WScript is default "object" to run script
' sleep: is delay time