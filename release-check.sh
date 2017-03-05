#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

test_git_working_dir() {
  # `git status --porcelain`, unlike `git diff`, will account for untracked files
  # However, it doesn't provide a meaningful exit code, so we check it's output instead
  if git_output=$(git status --porcelain) && [ -z "$git_output" ]; then
    echo -e "\n\r${GREEN}Working directory clean.${NC} Continuing...\n\r"
  else
    echo -e "\n\r${RED}The working directory is not clean.${NC}\n\rPlease clear the working directory and try again.\n\r"
    exit 1
  fi
}

test_npm_login() {
  if npm whoami; then
    echo -e "\n\r${GREEN}Logged in to \`npm\`.${NC} Continuing...\n\r"
  else
    echo -e "\n\r${RED}Not logged in to \`npm\`.${NC}\n\rPlease log in and try again.\n\r"
    exit 1
  fi
}

test_git_working_dir
test_npm_login