#!/usr/bin/env node

"use strict";

var fs = require("fs");
var path = require("path");
var chalk = require("chalk");
var copy = require("copy");
var mkdirp = require("mkdirp");
var argv = require("yargs").argv;
var pkg = require("./package.json");

if (argv.version || argv.v) {
  console.log(pkg.version);
  process.exit();
}

var dir = process.cwd();
if (argv._.length > 0) {
   dir = path.resolve(dir, argv._[0]);
}

console.log(chalk.green("Creating module..."));

mkdirp(dir, function(err) {
  if (err) {
    console.error(chalk.red("Failed to create target directory."));
    process.exit(1);
  }

  console.log(chalk.green("+", dir));

  copy(path.join(__dirname, "template", "*"), dir, { dot: true }, function(err, files) {
    if (err) {
      console.error(chalk.red("Failed to copy template files to target directory."));
      process.exit(1);
    }

    files.forEach(function(file) {
      console.log(chalk.green("+", file.path));
    });

    console.log(chalk.green("Module created!"));
  });
});
