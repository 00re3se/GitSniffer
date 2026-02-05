#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getGitDiff } from './git.js';
import { scanCode } from './scanner.js';
import { reportIssues } from './reporter.js';
import { defaultRules } from './config.js';
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
  .action(async (options) => {
    if (options.run) {
      console.log(chalk.cyan('Starting code analysis...'));
      
      const files = await getGitDiff();
      
      if (files.length === 0) {
        console.log(chalk.green('No staged changes detected.'));
        return;
      }

      const issues = scanCode(files, defaultRules);
      const exitCode = reportIssues(issues);
      
      process.exit(exitCode);
    } else {
      program.help();
    }
  });

program.parse(process.argv);