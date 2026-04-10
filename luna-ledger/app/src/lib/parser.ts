import Papa from 'papaparse';
import { SalesRow, Dataset } from '../types';

export const parseCSV = (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows: SalesRow[] = results.data.map((row: any) => {
            return {
              title: row['Title'] || 'Unknown',
              country: row['Country'] || 'Unknown',
              units: parseInt(row['Sales Units'] || '0', 10),
              grossUSD: parseFloat(row['Sales Amount in Payment Currency'] || '0'),
              netUSD: parseFloat(row['Final Payable Amount'] || '0'),
              withholdingTaxUSD: parseFloat(row['Withholding Tax in Payment Currency'] || '0'),
              period: row['Sales Period'] || 'Unknown',
            };
          });

          resolve({
            id: crypto.randomUUID(),
            name: file.name,
            uploadDate: Date.now(),
            rows,
          });
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
