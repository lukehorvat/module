"use strict";

var path = require("path");
var template = require("lodash.template");
var map = require("map-stream");
var fs = require("vinyl-fs");

module.exports = function(dir) {
  return new Promise(function(resolve, reject) {
    var files = [];

    fs
    .src(path.join(__dirname, "templates", "**", "*"), { dot: true })
    .pipe(map(function(file, cb) {
      file.contents = new Buffer(template(file.contents)({ name: path.basename(dir) }));
      cb(null, file);
    }))
    .once("error", reject)
    .pipe(fs.dest(dir))
    .pipe(map(function(file, cb) {
      files.push(file.path);
      cb();
    }))
    .once("end", function() {
      resolve(files);
    });
  });
};
