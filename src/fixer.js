import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import { defaultRules } from './config.js';

export async function fixIssues(issues) {
  const issuesByFile = issues.reduce((acc, issue) => {
    if (!acc[issue.file]) {
      acc[issue.file] = [];
    }
    acc[issue.file].push(issue);
    return acc;
  }, {});

  for (const [filePath, fileIssues] of Object.entries(issuesByFile)) {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');
      
      const issuesByLine = fileIssues.reduce((acc, issue) => {
        if (!acc[issue.line]) {
          acc[issue.line] = [];
        }
        acc[issue.line].push(issue);
        return acc;
      }, {});

      const lineNumbers = Object.keys(issuesByLine).map(Number).sort((a, b) => b - a);

      let fixedCount = 0;

      for (const lineNum of lineNumbers) {
        const arrayIndex = lineNum - 1;
        if (arrayIndex < 0 || arrayIndex >= lines.length) continue;

        const lineIssues = issuesByLine[lineNum];

        const isOnlyTodo = lineIssues.every(i => i.ruleId === 'no-todo');
        
        if (!isOnlyTodo) {
           console.log(chalk.gray(`Removing line ${lineNum} in ${filePath}`));
           lines.splice(arrayIndex, 1);
           fixedCount++;
           continue;
        }

        let lineContent = lines[arrayIndex];
        
        const todoRule = defaultRules.find(r => r.id === 'no-todo');
        if (todoRule) {
           const match = lineContent.match(todoRule.regex);
           if (match) {
             const contentBefore = lineContent.substring(0, match.index);
             
             if (contentBefore.trim().length === 0) {
               console.log(chalk.gray(`Removing line ${lineNum} in ${filePath} (comment only)`));
               lines.splice(arrayIndex, 1);
             } else {
               console.log(chalk.gray(`Trimming TODO from line ${lineNum} in ${filePath}`));
               lines[arrayIndex] = contentBefore.trimEnd();
             }
             fixedCount++;
           }
        }
      }

      if (fixedCount > 0) {
        writeFileSync(filePath, lines.join('\n'));
        console.log(chalk.green(`Fixed ${fixedCount} issues in ${filePath}`));
      }
    } catch (error) {
      console.error(chalk.red(`Failed to fix ${filePath}:`), error.message);
    }
  }
}
