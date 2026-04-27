@echo off
:: Try the standard install path first
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    goto :eof
)
:: Fallback: 64-bit install path
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    goto :eof
)
:: Last resort: let Windows find it
start "" msedge
