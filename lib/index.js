import path from "path";
import concat from "concat-stream";
import template from "lodash.template";
import map from "map-stream";
import fs from "vinyl-fs";
export default createModule;

function createModule(dir) {
  return new Promise((resolve, reject) => {
    fs
    .src(path.resolve(__dirname, "..", "templates", "**", "*"), { dot: true })
    .pipe(templateFiles({ name: path.basename(dir) }))
    .once("error", reject)
    .pipe(fs.dest(dir))
    .pipe(collectFiles(resolve));
  });
}

function templateFiles(data) {
  return map((file, cb) => {
    file.contents = new Buffer(template(file.contents)(data));
    cb(null, file);
  });
}

function collectFiles(cb) {
  return concat(files => cb(files.map(file => file.path)));
}
