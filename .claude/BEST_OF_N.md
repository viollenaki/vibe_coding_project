# Best-of-N Comparison

This document explains how to use the "Best-of-N" technique to compare model outputs, as practiced in Cursor or similar environments.

## Concept
Best-of-N sampling involves generating multiple responses (N) for the same prompt and then using a "judge" (either a human or another model) to select the best one. This helps in reducing variance and improving the quality of the final output.

## How to run in Cursor
1.  Open the Chat or Composer.
2.  Use the `/best-of-n` command (if available in your version/extension).
3.  Select the models you want to compare.
4.  Review the outputs side-by-side and pick the most accurate one.

## Simulation Script
See `simulate_best_of_n.py` for a CLI-based simulation of this workflow.
