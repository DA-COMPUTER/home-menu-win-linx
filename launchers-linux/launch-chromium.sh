#!/bin/bash
# Opens Chromium browser
# Raspberry Pi OS ships 'chromium-browser'; some distros use 'chromium'
if command -v chromium-browser &>/dev/null; then
    chromium-browser &
elif command -v chromium &>/dev/null; then
    chromium &
else
    xdg-open "https://www.google.com" &
fi
