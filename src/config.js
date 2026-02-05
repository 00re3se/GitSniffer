export const defaultRules = [
  {
    id: 'no-console',
    message: 'Found console.log usage',
    regex: /^(?!\s*\/\/).*console\.log\(/,
    severity: 'warning'
  },
  {
    id: 'no-todo',
    message: 'Found TODO comment',
    regex: /\/\/\s*TODO:/i,
    severity: 'info'
  },
  {
    id: 'no-private-keys',
    message: 'Potential private key found',
    regex: /-----BEGIN PRIVATE KEY-----/,
    severity: 'error'
  },
  {
    id: 'no-aws-keys',
    message: 'Potential AWS Access Key found',
    regex: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/,
    severity: 'error'
  },
  {
    id: 'no-debugger',
    message: 'Found debugger statement',
    regex: /debugger;?/,
    severity: 'error'
  }
];