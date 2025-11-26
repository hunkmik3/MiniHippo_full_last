#!/bin/bash
# Bash script to commit and push changes to Git
# Usage: ./git-commit-push.sh "Commit message"

COMMIT_MESSAGE="${1:-Update admin lessons management features}"

# Get the root directory of the repository
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
    echo "Error: Not in a Git repository"
    exit 1
fi

# Change to repository root
cd "$REPO_ROOT"

# Check if there are any changes
if [ -z "$(git status --porcelain)" ]; then
    echo "No changes to commit"
    exit 0
fi

# Show status
echo ""
echo "Changes to be committed:"
git status --short

# Add all changes
echo ""
echo "Adding all changes..."
git add .

# Commit
echo "Committing with message: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

if [ $? -ne 0 ]; then
    echo "Error: Commit failed"
    exit 1
fi

# Push to remote
echo ""
echo "Pushing to remote..."
git push

if [ $? -ne 0 ]; then
    echo "Error: Push failed"
    exit 1
fi

echo ""
echo "Successfully committed and pushed changes!"

