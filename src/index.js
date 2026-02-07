#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getGitDiff, isGitRepo } from './git.js';
import { scanCode } from './scanner.js';
import { reportIssues } from './reporter.js';
import { defaultRules } from './config.js';
import { fixIssues } from './fixer.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .name('gitsniffer')
  .description('Smart CLI tool to prevent committing bad code')
  .version(packageJson.version);

program
  .option('-r, --run', 'Run the sniffer on staged files')
  .option('-w, --working', 'Run the sniffer on working directory (unstaged changes)')
  .option('-f, --fix', 'Automatically fix detected issues by removing problematic lines')
  .action(async (options) => {
    if (options.fix && !options.run && !options.working) {
      options.run = true;
    }

    if (options.run || options.working) {
      if (!await isGitRepo()) {
        console.error(chalk.red('Error: Current directory is not a git repository.'));
        process.exit(1);
      }

      const mode = options.working ? 'working directory' : 'staged files';
      console.log(chalk.cyan(`Starting code analysis on ${mode}...`));
      
      try {
        const files = await getGitDiff({ type: options.working ? 'working' : 'staged' });
        
        if (files.length === 0) {
          console.log(chalk.green(`No changes detected in ${mode}.`));
          if (!options.working) {
            console.log(chalk.gray('(Hint: Use --working to scan unstaged files or "git add" your changes)'));
          }
          return;
        }

        const issues = scanCode(files, defaultRules);
        
        if (options.fix && issues.length > 0) {
          console.log(chalk.yellow('Applying fixes...'));
          await fixIssues(issues);
          console.log(chalk.green('Issues fixed.'));
          console.log(chalk.bold.yellow('\n⚠ IMPORTANT: Fixes were applied to your working directory.'));
          console.log(chalk.yellow('  You must run "git add ." (or specific files) to update the staged changes!'));
          process.exit(1);
        }

        const exitCode = reportIssues(issues);
        process.exit(exitCode);
      } catch (error) {
        console.error(chalk.red('Error during execution:'), error.message);
        process.exit(1);
      }
    } else {
      program.help();
    }
  });

program.parse(process.argv);