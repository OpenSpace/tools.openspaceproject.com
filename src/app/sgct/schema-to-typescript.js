"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = require("https");
var json_schema_to_typescript_1 = require("json-schema-to-typescript");
var fs_1 = require("fs");
// First, download the most current schema file
(0, fs_1.unlink)("sgct.schema.json", function () {
    var file = (0, fs_1.createWriteStream)("sgct.schema.json");
    (0, https_1.get)("https://raw.githubusercontent.com/sgct/sgct/master/sgct.schema.json", function (response) {
        response.pipe(file);
        file.on("finish", function () {
            file.close();
            (0, json_schema_to_typescript_1.compileFromFile)("./sgct.schema.json").then(function (ts) { return (0, fs_1.writeFileSync)("sgct.d.ts", ts); });
        });
    });
});
