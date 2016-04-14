"use strict";

var path = require("path");
var concat = require("concat-stream")
var template = require("lodash.template");
var map = require("map-stream");
var fs = require("vinyl-fs");

module.exports = createModule;

function createModule(dir) {
  return new Promise(function(resolve, reject) {
    fs
    .src(path.join(__dirname, "templates", "**", "*"), { dot: true })
    .pipe(templateFiles({ name: path.basename(dir) }))
    .once("error", reject)
    .pipe(fs.dest(dir))
    .pipe(collectFiles(resolve));
  });
}

function templateFiles(data) {
  return map(function(file, cb) {
    file.contents = new Buffer(template(file.contents)(data));
    cb(null, file);
  });
}

function collectFiles(cb) {
  return concat(function(files) {
    cb(files.map(function(file) { return file.path; }));
  });
}
