#!/usr/bin/env node

"use strict";

var path = require("path");
var chalk = require("chalk");
var map = require("map-stream");
var tildify = require("tildify");
var vfs = require("vinyl-fs");
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

vfs
  .src(path.join(__dirname, "template", "**", "*"), { dot: true })
  .pipe(vfs.dest(dir))
  .pipe(map(function(file, callback) {
    console.log(chalk.green("+", tildify(file.path)));
    callback();
  }))
  .once("end", function() {
    console.log(chalk.green("Module created!"));
  });
