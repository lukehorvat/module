import path from 'node:path';
import fs from 'node:fs/promises';
import type { Mode } from 'node:fs';

export async function createModule(
  dir: string,
  system: 'esm' | 'cjs',
  identifier: 'file-ext' | 'package-type' | 'syntax'
): Promise<string[]> {
  const name = path.basename(dir);
  const extension =
    identifier === 'file-ext' ? (system === 'esm' ? 'mjs' : 'cjs') : 'js';
  await fs.mkdir(dir, { recursive: true });
  return Promise.all([
    createIndexScript(),
    createCliScript(),
    createPackageJson(),
    createGitignore(),
    createReadme(),
  ]);

  async function createIndexScript(): Promise<string> {
    return createFile(
      `index.${extension}`,
      system === 'esm'
        ? `export default function () {\n  console.log('${name}');\n}\n`
        : `'use strict';\n\nmodule.exports = function () {\n  console.log('${name}');\n};\n`
    );
  }

  async function createCliScript(): Promise<string> {
    return createFile(
      `cli.${extension}`,
      system === 'esm'
        ? `#!/usr/bin/env node\n\nimport fn from './';\n\nfn();\n`
        : `#!/usr/bin/env node\n\n'use strict';\n\nconst fn = require('./');\n\nfn();\n`,
      0o755
    );
  }

  async function createPackageJson(): Promise<string> {
    return createFile(
      'package.json',
      `${JSON.stringify(
        {
          private: true,
          name,
          version: '0.0.0',
          type:
            identifier === 'package-type'
              ? system === 'esm'
                ? 'module'
                : 'commonjs'
              : undefined,
          main: `index.${extension}`,
          bin: `cli.${extension}`,
          dependencies: {},
          devDependencies: {},
        },
        null,
        2
      )}\n`
    );
  }

  async function createGitignore(): Promise<string> {
    return createFile('.gitignore', `node_modules/\n`);
  }

  async function createReadme(): Promise<string> {
    return createFile('README.md', `# ${name}\n\nTODO.\n`);
  }

  async function createFile(
    fileName: string,
    fileContent: string,
    mode?: Mode
  ): Promise<string> {
    const filePath = path.join(dir, fileName);
    await fs.writeFile(filePath, fileContent, { mode });
    return filePath;
  }
}
