// watch-minify.js
import chokidar from "chokidar";
import { minify as minifyHTML } from "html-minifier-terser";
import CleanCSS from "clean-css";
import * as terser from "terser";
import fs from "fs";
import path from "path";

const distDir = "dist"; // dossier de sortie

// Vérifie que dist existe
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Fonction utilitaire pour sauvegarder le fichier minifié
function saveFile(srcPath, minifiedContent) {
  const relativePath = path.relative(".", srcPath); // relatif à la racine du projet
  const outPath = path.join(distDir, relativePath);

  // crée les dossiers si nécessaires
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  fs.writeFileSync(outPath, minifiedContent, "utf-8");
  console.log(`✅ Minified: ${relativePath} → ${outPath}`);
}

// Fonction pour minifier
async function minifyFile(filePath) {
  if (filePath.endsWith(".html")) {
    const content = fs.readFileSync(filePath, "utf-8");
    const minified = await minifyHTML(content, {
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
    });
    saveFile(filePath, minified);
  } else if (filePath.endsWith(".css")) {
    const content = fs.readFileSync(filePath, "utf-8");
    const minified = new CleanCSS().minify(content).styles;
    saveFile(filePath, minified);
  } else if (filePath.endsWith(".js")) {
    const content = fs.readFileSync(filePath, "utf-8");
    const minified = (await terser.minify(content)).code;
    saveFile(filePath, minified);
  }
}

// Surveillance recursive de tout sauf dist
chokidar
  .watch(["./**/*.html", "./**/*.css", "./**/*.js"], {
    ignored: distDir, // ignore dist
    persistent: true,
  })
  .on("change", (filePath) => {
    console.log(`🔄 File changed: ${filePath}`);
    minifyFile(filePath);
  });

console.log("👀 Watching for changes in project...");
