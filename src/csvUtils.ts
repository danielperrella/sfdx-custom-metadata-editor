import { ExportToCsv } from 'export-to-csv';
let csvToJson = require('convert-csv-to-json');
const csv = require('csvtojson');


export function toCsv(data: any): any {
  const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: false,
    showTitle: false,
    title: '',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };

  const csvExporter = new ExportToCsv(options);

  return csvExporter.generateCsv(data, true);
}

export function toJson(csvFilePath: string): Promise<any> {
  // return csvToJson.fieldDelimiter(',').formatValueByType().getJsonFromCsv(csvPath);
  return csv({
    checkType: true,
    nullObject: true
  }).fromFile(csvFilePath);
}

