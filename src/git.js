import { execa } from 'execa';
import { extname } from 'path';

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico',
  '.pdf', '.zip', '.tar', '.gz', '.7z',
  '.exe', '.dll', '.so', '.dylib', '.bin',
  '.mp3', '.mp4', '.mov', '.avi', '.woff', '.woff2', '.ttf', '.eot'
]);

export async function getGitDiff() {
  try {
    const { stdout: stagedFiles } = await execa('git', ['diff', '--name-only', '--cached']);
    
    const { stdout: diffOutput } = await execa('git', ['diff', '--cached', '--unified=0']);
    
    return parseDiff(diffOutput);
  } catch (error) {
    console.error('Error executing git command:', error.message);
    return [];
  }
}

function parseDiff(diffOutput) {
  const files = [];
  let currentFile = null;

  const lines = diffOutput.split('\n');

  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      const match = line.match(/b\/(.*)$/);
      if (match) {
        const filePath = match[1];
        
        if (isBinaryFile(filePath)) {
          currentFile = null;
          continue;
        }

        currentFile = {
          path: filePath,
          changes: []
        };
        files.push(currentFile);
      }
    } else if (line.startsWith('@@')) {
      const match = line.match(/\+(\d+)(?:,(\d+))?/);
      if (match && currentFile) {
        currentFile.currentLineNumber = parseInt(match[1], 10);
      }
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      if (currentFile && currentFile.currentLineNumber !== undefined) {
        currentFile.changes.push({
          line: currentFile.currentLineNumber,
          content: line.substring(1)
        });
        currentFile.currentLineNumber++;
      }
    }
  }

  return files;
}

function isBinaryFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  return BINARY_EXTENSIONS.has(ext);
}