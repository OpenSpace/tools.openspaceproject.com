import { get } from "https";
import { compileFromFile } from "json-schema-to-typescript";
import { createWriteStream, unlink, writeFileSync } from "fs";


// First, download the most current schema file
unlink(
  "sgct.schema.json",
  () => {
    let file = createWriteStream("sgct.schema.json");
    get(
      "https://raw.githubusercontent.com/sgct/sgct/master/sgct.schema.json",
      (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          compileFromFile("./sgct.schema.json").then(ts => writeFileSync("sgct.d.ts", ts));
        });
      }
    );
  }
);


