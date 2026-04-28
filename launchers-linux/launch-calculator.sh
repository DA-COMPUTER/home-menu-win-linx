#!/bin/bash
# Opens a calculator
# Fallback chain: galculator → gnome-calculator → kcalc
if command -v galculator &>/dev/null; then
    galculator &
elif command -v gnome-calculator &>/dev/null; then
    gnome-calculator &
elif command -v kcalc &>/dev/null; then
    kcalc &
else
    echo "No calculator found. Install galculator: sudo apt install galculator"
fi
