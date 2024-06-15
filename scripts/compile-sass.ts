import path from "path";
import { fileURLToPath } from "url";
import * as sass from "sass";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themes_dir = path.join(__dirname, "../themes");

const compileSass = async (path: string) => {
  const result = await sass.compileAsync(path);
  const cssFilePath = path.replace(/\.scss$/, ".css");
  fs.writeFileSync(cssFilePath, result.css);
  console.log(`Compiled ${path} to ${cssFilePath}`);
};

const processDirectory = (dir: string) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}: `, err);
      return;
    }

    files.forEach((file) => {
      const fullPath = path.join(dir, file);

      fs.stat(fullPath, (err, stats) => {
        if (err) {
          console.error(`Error stat-ing file ${fullPath}: `, err);
          return;
        }

        if (stats.isDirectory()) {
          processDirectory(fullPath);
        } else if (stats.isFile() && path.extname(fullPath) === ".scss") {
          compileSass(fullPath);
        }
      });
    });
  });
};

processDirectory(themes_dir);
