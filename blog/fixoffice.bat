fltmc>nul||cd/d %~dp0&&mshta vbscript:CreateObject("Shell.Application").ShellExecute("%~nx0","%1","","runas",1)(window.close)&&exit
echo off
echo fix Microsoft Office 
echo by Xingzhenghang
cacls C:\Windows\System32\spp /T /E /G NT SERVICE\sppsvc:F
echo Y|
pause