import { Parser } from "xml2js";


export async function readFile(file: File): Promise<string> {
  let result: Promise<string> | string = await new Promise((resolve, reject) => {
    let reader = new FileReader;
    reader.onload = (e) => reader.result ? resolve(reader.result.toString()) : reject(e.target?.error);
    reader.onerror = (e) => reject(e.target?.error);
    reader.readAsText(file);
  });
  return result;
}

export async function convertXmlToJson(content: string): Promise<object> {
  let result: Promise<object> | object = await new Promise((resolve, reject) => {
    let parser = new Parser({
      explicitRoot: false,
      explicitArray: true,
      mergeAttrs: true
    });
    parser.parseString(
      content,
      (err, result) => err ? reject(err) : resolve(result)
    );
  });
  return result;
}
