#!/bin/bash
# Opens the GNOME Files file manager (Nautilus)
# Fallback chain: nautilus → thunar (XFCE) → pcmanfm (LXDE/Pi default)
if command -v nautilus &>/dev/null; then
    nautilus &
elif command -v thunar &>/dev/null; then
    thunar &
elif command -v pcmanfm &>/dev/null; then
    pcmanfm &
else
    xdg-open "$HOME" &
fi
