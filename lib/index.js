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
    .pipe(renameFiles({ gitignore: ".gitignore" })) // See: https://github.com/npm/npm/issues/3763
    .pipe(templateFiles({ name: path.basename(dir) }))
    .once("error", reject)
    .pipe(fs.dest(dir))
    .pipe(collectFiles(resolve));
  });
}

function renameFiles(renames) {
  return map((file, cb) => {
    if (file.basename in renames) {
      file.basename = renames[file.basename];
    }
    cb(null, file);
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
