#!/usr/bin/env node

"use strict";

const argv = require("yargs").argv;
const pkg = require("./package.json");

if (argv.version || argv.v) {
  console.log(pkg.version);
  process.exit();
}

console.log("module");
