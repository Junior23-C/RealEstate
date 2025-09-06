#!/usr/bin/env python3
"""
Git Push Automation Script
Automates common git operations like add, commit, and push.

Usage:
    python scripts/git-push.py                           # Interactive mode
    python scripts/git-push.py "Your commit message"     # Quick commit with message
    python scripts/git-push.py --status                  # Just show git status
    python scripts/git-push.py --push                    # Just push existing commits
"""

import subprocess
import sys
import os
from datetime import datetime

def run_command(cmd, capture_output=True):
    """Run a shell command and return the result."""
    try:
        if capture_output:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=os.getcwd())
            return result.returncode == 0, result.stdout.strip(), result.stderr.strip()
        else:
            result = subprocess.run(cmd, shell=True, cwd=os.getcwd())
            return result.returncode == 0, "", ""
    except Exception as e:
        return False, "", str(e)

def get_git_status():
    """Get current git status."""
    success, stdout, stderr = run_command("git status --porcelain")
    if not success:
        print(f"❌ Error getting git status: {stderr}")
        return None
    return stdout

def show_git_status():
    """Show detailed git status."""
    print("📊 Current Git Status:")
    print("=" * 50)
    
    # Show branch
    success, branch, _ = run_command("git branch --show-current")
    if success:
        print(f"🌿 Current branch: {branch}")
    
    # Show status
    success, status, _ = run_command("git status", capture_output=False)
    
    # Show recent commits
    print("\n📜 Recent commits:")
    success, commits, _ = run_command("git log --oneline -5")
    if success:
        for line in commits.split('\n'):
            print(f"  {line}")

def get_changed_files():
    """Get list of changed files."""
    status = get_git_status()
    if status is None:
        return []
    
    files = []
    for line in status.split('\n'):
        if line.strip():
            status_code = line[:2]
            filename = line[3:]
            files.append((status_code, filename))
    
    return files

def interactive_commit():
    """Interactive commit process."""
    print("🔄 Interactive Git Commit Process")
    print("=" * 50)
    
    # Check for changes
    changed_files = get_changed_files()
    if not changed_files:
        print("✅ No changes to commit. Repository is clean.")
        return False
    
    # Show changed files
    print(f"\n📝 Found {len(changed_files)} changed files:")
    for status_code, filename in changed_files:
        status_symbol = {
            'M ': '📝', 'A ': '🆕', 'D ': '🗑️', 'R ': '🔄', 'C ': '📄',
            '??': '❓', ' M': '📝', ' D': '🗑️', 'MM': '📝'
        }.get(status_code, '📄')
        print(f"  {status_symbol} {status_code} {filename}")
    
    # Get commit message
    print(f"\n💬 Enter commit message (or 'q' to quit):")
    message = input("Message: ").strip()
    
    if message.lower() == 'q':
        print("❌ Commit cancelled.")
        return False
    
    if not message:
        # Generate default message based on changes
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
        message = f"Update project files - {timestamp}"
        print(f"📝 Using default message: {message}")
    
    # Add files
    print("📦 Adding files to git...")
    success, _, stderr = run_command("git add .")
    if not success:
        print(f"❌ Error adding files: {stderr}")
        return False
    
    # Commit
    full_message = f"""{message}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"""
    
    print("💾 Creating commit...")
    success, _, stderr = run_command(f'git commit -m "{full_message}"')
    if not success:
        print(f"❌ Error creating commit: {stderr}")
        return False
    
    print("✅ Commit created successfully!")
    return True

def push_changes():
    """Push changes to remote repository."""
    print("🚀 Pushing to GitHub...")
    
    # Get current branch
    success, branch, _ = run_command("git branch --show-current")
    if not success:
        print("❌ Could not determine current branch")
        return False
    
    # Push
    success, stdout, stderr = run_command(f"git push origin {branch}")
    if not success:
        print(f"❌ Error pushing to GitHub: {stderr}")
        return False
    
    print("✅ Successfully pushed to GitHub!")
    return True

def quick_commit(message):
    """Quick commit with provided message."""
    changed_files = get_changed_files()
    if not changed_files:
        print("✅ No changes to commit. Repository is clean.")
        return False
    
    print(f"📦 Adding and committing {len(changed_files)} changed files...")
    
    # Add files
    success, _, stderr = run_command("git add .")
    if not success:
        print(f"❌ Error adding files: {stderr}")
        return False
    
    # Commit with full message
    full_message = f"""{message}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"""
    
    success, _, stderr = run_command(f'git commit -m "{full_message}"')
    if not success:
        print(f"❌ Error creating commit: {stderr}")
        return False
    
    print("✅ Commit created successfully!")
    return True

def main():
    """Main function."""
    print("🐙 Git Push Automation Script")
    print("=" * 50)
    
    # Parse arguments
    args = sys.argv[1:]
    
    if len(args) == 0:
        # Interactive mode
        show_git_status()
        if interactive_commit():
            push_changes()
    
    elif len(args) == 1:
        if args[0] == "--status":
            show_git_status()
            return
        
        elif args[0] == "--push":
            push_changes()
            return
        
        elif args[0] == "--help":
            print(__doc__)
            return
        
        else:
            # Quick commit mode
            message = args[0]
            if quick_commit(message):
                push_changes()
    
    else:
        print("❌ Too many arguments. Use --help for usage information.")
        sys.exit(1)

if __name__ == "__main__":
    # Make sure we're in the right directory
    if not os.path.exists('.git'):
        print("❌ Error: Not in a git repository!")
        print("Make sure you're running this script from the project root directory.")
        sys.exit(1)
    
    main()