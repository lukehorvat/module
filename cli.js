#!/usr/bin/env node

"use strict";

var module = require("./");
var pkg = require("./package.json");
var path = require("path");
var chalk = require("chalk");
var tildify = require("tildify");
var yargs = require("yargs");
var argv =
  yargs
  .usage("Usage: $0 <dir>")
  .demand(0, 1)
  .option("h", { alias: "help", describe: "Show help" })
  .option("v", { alias: "version", describe: "Show version" })
  .argv;

if (argv.help || argv.h) {
  yargs.showHelp();
  process.exit();
}

if (argv.version || argv.v) {
  console.log(pkg.version);
  process.exit();
}

Promise.resolve(
  path.resolve(process.cwd(), argv._.length ? argv._[0] : ".")
).then(function(dir) {
  console.log(chalk.green("Creating module..."));
  return module(dir);
}).then(function(files) {
  files.map(tildify).forEach(function(file) {
    console.log(chalk.green("+", file));
  });
}).then(function() {
  console.log(chalk.green("Module created!"));
  process.exit();
}).catch(function() {
  console.error(chalk.red("An error occurred."));
  process.exit(1);
});
