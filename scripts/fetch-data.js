// native
const path = require("path");

// packages
const colors = require("ansi-colors");
const fs = require("fs-extra");

// internal
const { google } = require("googleapis");
const { docToArchieML } = require("@newswire/doc-to-archieml");
const { sheetToData } = require("@newswire/sheet-to-data");
const config = require("../config");

async function getData() {
  const auth = await google.auth.getClient({
    scopes: [
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/spreadsheets.readonly",
    ],
  });

  const { dataMutators, files } = config;
  for (const file of files) {
    const filepath = path.join("src/data", `${file.name}.json`);
    const mutator =
      dataMutators && dataMutators[file.name]
        ? dataMutators[file.name]
        : (d) => d;

    let data;
    let color;

    switch (file.type) {
      case "doc":
        data = await docToArchieML({ documentId: file.fileId, auth });
        color = "magenta";
        break;
      case "sheet":
        data = await sheetToData({ auth, spreadsheetId: file.fileId });
        color = "cyan";
        break;
      default:
        throw new Error(
          `No data fetching method found for type "${file.type}"`
        );
    }

    data = mutator(data);
    await fs.outputJson(filepath, data, { spaces: 2 });

    logDownload(file.name, file.fileId, color);
  }
}

function logDownload(fileName, fileId, color) {
  console.log(colors[color](`Downloaded \`${fileName}\` (${fileId})`));
}

getData().catch(console.error);
