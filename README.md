# GitSniffer
### Smart Code Sentry for Your Terminal

> "If it's not clean, it's not finished."

GitSniffer is a CLI tool designed to act as an intelligent filter for your codebase. It ensures that no debug leftovers, private keys, or sloppy comments make their way into your repository. It's not just a linter, it's a gatekeeper for quality.

![Terminal Preview](src/assets/terminal.png)

## 🚀 The Philosophy
I build ecosystems where quality is non-negotiable. GitSniffer was born from a simple need: **intentionality**.

*   **Security First**: Prevent API key leaks before they happen.
*   **Clean Code**: Stop `console.log` and `debugger` statements from polluting production.
*   **Efficiency**: Catch errors in the staging area, seconds before the commit.

## ⚙️ How It Works
GitSniffer hooks into your workflow at the most critical moment: **pre-commit**.

1.  **Scans**: It analyzes *only* your staged changes (`git diff --cached`).
2.  **Sniffs**: Applies regex-based heuristics to detect code smells and security risks.
3.  **Blocks**: If it finds a critical error (like a private key), it stops the commit.

## 🔧 Installation
Install it globally to use it across all your projects:

```bash
npm install -g @re3se/gitsniffer
```

## 🚀 Usage
Run it manually in any git repository:

```bash
gitsniffer --run
```

### Advanced Options

**Scan Working Directory (Unstaged)**
If you want to check your code *before* staging it:
```bash
gitsniffer --working
```

**Auto-Fix Issues**
Automatically remove `console.log`, `debugger`, and other problematic lines:
```bash
gitsniffer --fix
```
> **Note:** After running `--fix`, you must run `git add .` to update your staged changes.

### Automate with Git Hooks
To enforce quality standards automatically, add it to your pre-commit hook.

**Option 1: Raw Git Hook**
Add this to `.git/hooks/pre-commit` and make it executable (`chmod +x`):
```bash
#!/bin/sh
gitsniffer --run
```

**Option 2: Husky**
If you use Husky in your project:
```bash
npx husky add .husky/pre-commit "gitsniffer --run"
```

## 🛡️ Default Rules
GitSniffer comes pre-configured with a zero-tolerance policy for:

*   🔴 **Private Keys** (AWS, RSA, generic private keys) -> `[ERROR]` (Blocks commit)
*   🔴 **Debugger Statements** -> `[ERROR]` (Blocks commit)
*   🟡 **Console Logs** -> `[WARNING]`
*   🔵 **TODO Comments** -> `[INFO]`

## 🛠️ Tech Stack
Built with intentionality using:
*   **Node.js**
*   **Commander.js**
*   **Execa**
*   **Chalk**

---