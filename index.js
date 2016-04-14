#!/usr/bin/env node

"use strict";

var pkg = require("./package.json");
var path = require("path");
var chalk = require("chalk");
var template = require("lodash.template");
var map = require("map-stream");
var tildify = require("tildify");
var vfs = require("vinyl-fs");
var yargs = require("yargs");
var argv = yargs
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

var dir = process.cwd();
if (argv._.length > 0) {
   dir = path.resolve(dir, argv._[0]);
}

console.log(chalk.green("Creating module..."));

vfs
  .src(path.join(__dirname, "templates", "**", "*"), { dot: true })
  .pipe(map(function(file, callback) {
    file.contents = new Buffer(template(file.contents)({ name: path.basename(dir) }));
    callback(null, file);
  }))
  .once("error", function() {
    console.error(chalk.red("An error occurred."));
    process.exit(1);
  })
  .pipe(vfs.dest(dir))
  .pipe(map(function(file, callback) {
    console.log(chalk.green("+", tildify(file.path)));
    callback();
  }))
  .once("end", function() {
    console.log(chalk.green("Module created!"));
    process.exit();
  });
