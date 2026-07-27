@echo off
echo =======================================================
echo  Job Application Tracker - GitHub Repository Setup
echo =======================================================

:: 1. Remove nested .git folder inside backend/ if present
if exist "backend\.git" (
    echo [1/4] Removing nested backend\.git folder...
    rmdir /s /q "backend\.git"
)

:: 2. Initialize root git repository
if not exist ".git" (
    echo [2/4] Initializing Git repository at root...
    git init
    git branch -M main
) else (
    echo [2/4] Git repository already initialized.
)

:: 3. Stage and commit files
echo [3/4] Staging project files...
git add .
git commit -m "feat: initial commit with backend, frontend, docs, and project configurations"

:: 4. Create repository on GitHub and push
echo [4/4] Creating GitHub repository and pushing code...
where gh >nul 2>&1
if %ERRORLEVEL% equ 0 (
    gh repo create job-application-tracker --public --source=. --remote=origin --push
) else (
    echo.
    echo GitHub CLI (gh) is not installed or not in PATH.
    echo Please create a new repository on https://github.com/new and execute:
    echo   git remote add origin https://github.com/YOUR_USERNAME/job-application-tracker.git
    echo   git push -u origin main
)

pause
