#!/bin/bash
# Opens a terminal emulator
# Fallback chain: lxterminal (Pi default) → xterm → xfce4-terminal
if command -v lxterminal &>/dev/null; then
    lxterminal &
elif command -v xfce4-terminal &>/dev/null; then
    xfce4-terminal &
elif command -v gnome-terminal &>/dev/null; then
    gnome-terminal &
else
    xterm &
fi
