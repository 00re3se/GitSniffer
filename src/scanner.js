export function scanCode(files, rules) {
  const issues = [];

  for (const file of files) {
    for (const change of file.changes) {
      for (const rule of rules) {
        if (rule.regex.test(change.content)) {
          issues.push({
            file: file.path,
            line: change.line,
            content: change.content.trim(),
            ruleId: rule.id,
            message: rule.message,
            severity: rule.severity
          });
        }
      }
    }
  }

  return issues;
}