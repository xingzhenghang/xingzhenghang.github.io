fltmc>nul||cd/d %~dp0&&mshta vbscript:CreateObject("Shell.Application").ShellExecute("%~nx0","%1","","runas",1)(window.close)&&exit
echo off
echo 修复 Microsoft Office 激活问题
echo by Xingzhenghang
echo Y|cacls C:\Windows\System32\spp /T /E /G NT SERVICE\sppsvc:F
pause