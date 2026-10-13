# Git & GitHub Workflow --- Daily Developer Guide

A practical guide for managing projects with Git and GitHub, including
your `nodejs-journey` repository.

## 1. Git vs GitHub

-   **Git:** Tracks file changes on your computer.
-   **GitHub:** Hosts your repositories online.
-   **Commit:** A saved snapshot of changes.
-   **Branch:** An independent line of development.
-   **Remote:** A link to a hosted repository.
-   **Push:** Upload local commits.
-   **Pull:** Download and integrate remote changes.
-   **Clone:** Copy a remote repository to your computer.
-   **Pull request (PR):** Propose changes for review and merging.

## 2. One-Time Setup

Install Git, then configure your identity:

``` bash
git --version
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"
git config --global init.defaultBranch main
```

Check the configuration:

``` bash
git config --global --list
```

Use an email linked to your GitHub account if you want commits linked to
your profile. A GitHub private noreply email is also an option.

## 3. Create a Local Project and Push It

``` bash
mkdir my-project
cd my-project
git init
git branch -M main
touch README.md
git status
git add README.md
git commit -m "docs: add project README"
```

Create an empty repository on GitHub, then connect and push:

``` bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git remote -v
git push -u origin main
```

Replace the example URL with your real repository URL. GitHub
authentication may require browser sign-in, SSH, or an approved
credential manager. Your regular GitHub account password is not accepted
for HTTPS Git operations.

## 4. Daily Workflow

### Step 1 --- Open your project

``` bash
cd path/to/your-project
```

### Step 2 --- Check your current state

``` bash
git status
git branch
git remote -v
```

### Step 3 --- Get remote changes if needed

``` bash
git pull
```

Do this especially when working from multiple computers or when files
may have changed on GitHub. If you have uncommitted edits, commit or
safely stash them before pulling when necessary.

### Step 4 --- Write and test your code

Make your changes, run the program, and test it.

### Step 5 --- Review changes

``` bash
git diff
git status
```

### Step 6 --- Stage the files you want to commit

Stage one file:

``` bash
git add path/to/file.js
```

Or stage all changes under the current directory:

``` bash
git add .
```

Review staged changes:

``` bash
git diff --staged
git status
```

**Important:** Check that you are not staging `.env` files, secrets,
private documents, generated files, or unwanted large files.

### Step 7 --- Commit

``` bash
git commit -m "learn: practice Node.js file system module"
```

### Step 8 --- Push to GitHub

``` bash
git push
```

For the first push of a new branch:

``` bash
git push -u origin branch-name
```

**Daily cycle:** Edit → Review → Stage → Commit → Push.

## 5. Useful Commands

  Command                          Purpose
  -------------------------------- --------------------------------------------------
  `git status`                     Check changed and staged files
  `git add file.js`                Stage a specific file
  `git add .`                      Stage changes under the current directory
  `git commit -m "message"`        Save a commit
  `git log --oneline`              View recent commits
  `git diff`                       View unstaged changes
  `git diff --staged`              View staged changes
  `git restore file.js`            Discard unstaged edits in a file
  `git restore --staged file.js`   Unstage a file but keep its edits
  `git fetch`                      Download remote updates without integrating them
  `git pull`                       Fetch and integrate remote changes
  `git push`                       Upload local commits
  `git remote -v`                  Show remote URLs
  `git branch`                     List local branches
  `git switch -c feature/name`     Create and switch to a branch
  `git switch main`                Switch to `main`
  `git merge feature/name`         Merge a branch into the current branch
  `git stash`                      Temporarily store uncommitted changes

**Caution:** `git restore file.js` discards unstaged edits to that file.

## 6. Node.js `.gitignore`

Create a `.gitignore` file in the project root:

``` gitignore
node_modules/
.env
.env.*
!.env.example
*.log
logs/
dist/
build/
coverage/
.vscode/
.idea/
.DS_Store
Thumbs.db
```

Adjust it for your project. Only commit `.env.example` if it contains
placeholders, not real secrets.

For npm projects, normally commit `package.json` and
`package-lock.json`, but not `node_modules/`.

If a file was already committed before being added to `.gitignore`, stop
tracking it while keeping the local copy:

``` bash
git rm --cached path/to/file
git commit -m "chore: stop tracking ignored file"
git push
```

If you accidentally expose a secret, revoke or rotate it immediately.
Deleting it in a later commit does not erase it from Git history.

## 7. Branch Workflow

Branches are useful for separate features or experiments.

``` bash
git switch main
git pull
git switch -c feature/add-login
```

Work, test, and commit your changes:

``` bash
git add .
git commit -m "feat: add login endpoint"
git push -u origin feature/add-login
```

On GitHub, open a pull request to merge the branch into `main`. After
merging:

``` bash
git switch main
git pull
```

For small solo exercises, committing directly to `main` is fine.

## 8. Merge Conflicts

1.  Run `git status` to identify conflicted files.
2.  Open each file and find `<<<<<<<`, `=======`, and `>>>>>>>`.
3.  Edit the file to keep the correct content and remove the markers.
4.  Test the result.
5.  Stage and commit the resolved file.

``` bash
git add path/to/resolved-file.js
git commit -m "fix: resolve merge conflict"
```

Read Git's status carefully if a merge or rebase is in progress. Do not
blindly delete files or run reset commands.

## 9. Common Problems

### `nothing to commit`

Save your files and check that you are in the correct repository. Git
may have no new changes to record.

### `remote origin already exists`

Inspect the remote:

``` bash
git remote -v
```

If the URL is wrong:

``` bash
git remote set-url origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

### Push rejected: `fetch first` or non-fast-forward

The remote contains commits missing locally. Usually, run `git pull`,
resolve any conflicts, and then push. Do not use force-push as your
first solution.

### Accidentally staged a file

``` bash
git restore --staged path/to/file
```

This unstages it but keeps your edits.

## 10. Commit Message Style

-   `feat:` --- new feature
-   `fix:` --- bug fix
-   `docs:` --- documentation
-   `learn:` --- learning exercise
-   `test:` --- tests
-   `refactor:` --- code restructuring
-   `chore:` --- maintenance or configuration

Examples:

``` text
learn: practice callbacks and promises
docs: add notes on Node.js modules
feat: implement notes creation
fix: handle invalid user input
test: add calculator tests
chore: add Node.js gitignore
```

## 11. Daily GitHub Checklist

-   [ ] Learn a concept.
-   [ ] Write and run the code yourself.
-   [ ] Review changes with `git diff`.
-   [ ] Check `git status` for accidental files or secrets.
-   [ ] Stage the intended files.
-   [ ] Commit with a meaningful message.
-   [ ] Push to GitHub.
-   [ ] Update `progress.md` if a topic was completed.

A small, meaningful commit is better than empty commits made only to
create a contribution streak.

## 12. Daily Cheat Sheet

Run these commands from your project directory:

``` bash
git status
git pull
# Edit and test your files
git diff
git add .
git diff --staged
git commit -m "learn: describe what I practiced"
git push
```

Use `git pull` first when remote changes may exist. Always review staged
files before committing.

------------------------------------------------------------------------

**My rule:** Write code, understand it, test it, commit it, and push it.
GitHub should show real learning progress---not just a green
contribution graph.
