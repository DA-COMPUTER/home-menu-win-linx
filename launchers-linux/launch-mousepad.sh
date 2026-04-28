#!/bin/bash
# Opens a text editor
# Fallback chain: mousepad (XFCE) → gedit (GNOME) → nano in terminal
if command -v mousepad &>/dev/null; then
    mousepad &
elif command -v gedit &>/dev/null; then
    gedit &
elif command -v leafpad &>/dev/null; then
    leafpad &
else
    lxterminal -e nano &
fi
