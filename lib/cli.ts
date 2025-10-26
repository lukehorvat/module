#!/usr/bin/env node

import path from 'node:path';
import kleur from 'kleur';
import tildify from 'tildify';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createModule } from './';

const parser = yargs(hideBin(process.argv))
  .command('$0 [name]', 'The default command', (yargs) =>
    yargs.positional('name', {
      describe: 'Module name or directory path',
      type: 'string',
      default: '.',
    })
  )
  .option('system', {
    alias: 's',
    describe: 'Module system',
    choices: ['esm', 'cjs'] as const,
    default: 'esm',
  })
  .option('identifier', {
    alias: 'i',
    describe: 'Module system identifier',
    choices: ['file-ext', 'package-type', 'syntax'] as const,
    default: 'file-ext',
  })
  .alias('help', 'h')
  .alias('version', 'v')
  .usage('$0 [name] [options]')
  .strict();

(async () => {
  try {
    const { name, system, identifier } = await parser.parse();
    console.log(kleur.green('Creating module...'));
    const files = await createModule(
      path.resolve(process.cwd(), name as string),
      system as 'esm' | 'cjs',
      identifier as 'file-ext' | 'package-type' | 'syntax'
    );
    for (const file of files) {
      console.log(kleur.green(`+ ${tildify(file)}`));
    }
    console.log(kleur.green('Module created!'));
  } catch (error) {
    console.error(kleur.red('An error occurred!'));
    throw error;
  }
})();
