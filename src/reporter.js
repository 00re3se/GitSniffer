import chalk from 'chalk';

export function reportIssues(issues) {
  if (issues.length === 0) {
    console.log(chalk.green('No issues found.'));
    return 0;
  }

  console.log(chalk.bold.underline(`Found ${issues.length} potential issues:\n`));

  let errorCount = 0;
  let warningCount = 0;

  issues.forEach(issue => {
    const location = chalk.gray(`${issue.file}:${issue.line}`);
    let severityLabel;
    let messageColor;

    switch (issue.severity) {
      case 'error':
        severityLabel = chalk.red('[ERROR]');
        messageColor = chalk.red;
        errorCount++;
        break;
      case 'warning':
        severityLabel = chalk.yellow('[WARNING]');
        messageColor = chalk.yellow;
        warningCount++;
        break;
      case 'info':
        severityLabel = chalk.blue('[INFO]');
        messageColor = chalk.blue;
        break;
      default:
        severityLabel = chalk.white('[UNKNOWN]');
        messageColor = chalk.white;
    }

    console.log(`  ${severityLabel} ${messageColor(issue.message)}`);
    console.log(`     Location: ${location}`);
    console.log(`     Code:     ${chalk.gray(issue.content)}`);
    console.log('');
  });

  if (errorCount > 0) {
    console.log(chalk.red.bold(`Analysis complete: ${errorCount} errors and ${warningCount} warnings found.`));
    return 1;
  } else {
    console.log(chalk.yellow.bold(`Analysis complete: ${warningCount} warnings found.`));
    return 0;
  }
}