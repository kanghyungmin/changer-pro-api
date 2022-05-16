import { Parser } from 'json2csv';

export const exportCsv = (data, fields) => {
  const csvParser = new Parser({
    fields,
    includeEmptyRows: true,
  });

  const csv: string = csvParser.parse(data);

  return csv;
};
