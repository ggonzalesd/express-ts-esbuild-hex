import fs from 'node:fs';

const fileCache = new Map<string, string>();

export const fileCacher = (filePath: string) => {
  if (fileCache.has(filePath)) {
    return fileCache.get(filePath)!;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  fileCache.set(filePath, fileContent);
  return fileContent;
};
