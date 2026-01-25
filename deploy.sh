#!/bin/bash

# Financial Dashboard Deployment Script

echo "🚀 Starting Financial Dashboard Deployment..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git first."
    exit 1
fi

echo "✅ Git repository found"

# Add all changes
echo "📝 Adding all changes to git..."
git add .

# Check if there are any changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "feat: Add MongoDB authentication system with user registration and login

- Implement JWT-based authentication with registration and login
- Add MongoDB models for Users and FinancialRecords
- Create protected API endpoints for financial data
- Update frontend components to support user authentication
- Add React Context for authentication state management
- Configure Render deployment with MongoDB Atlas integration
- Maintain compatibility with existing n8n workflows"
    
    if [ $? -eq 0 ]; then
        echo "✅ Changes committed successfully"
    else
        echo "⚠️  No changes to commit or commit failed"
    fi
fi

# Check if remote origin exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "📡 Pushing to origin..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Changes pushed to GitHub successfully"
        echo ""
        echo "🎉 Deployment ready!"
        echo ""
        echo "Next steps:"
        echo "1. Render backend will automatically deploy from the backend/ directory"
        echo "2. Backend URL: https://financial-dashboard-backend.onrender.com"
        echo "3. Frontend URL: https://finihon.onrender.com"
        echo "4. MongoDB Atlas is already configured"
        echo ""
        echo "To test the deployment:"
        echo "- Visit your frontend URL"
        echo "- Click 'Sign Up' to create a new account"
        echo "- Login and test document uploads"
    else
        echo "❌ Failed to push to GitHub"
        exit 1
    fi
else
    echo "⚠️  No remote origin found. Please add your remote repository:"
    echo "   git remote add origin <your-repository-url>"
    echo "   git push -u origin main"
fi

echo ""
echo "✨ Deployment process completed!"