import Papa from 'papaparse';
import { SalesRow, Dataset } from '../types';

const countryNameToCode: Record<string, string> = {
  "Austria": "AT",
  "Canada": "CA",
  "Switzerland": "CH",
  "Czech Republic": "CZ",
  "Germany": "DE",
  "Russian Federation": "RU",
  "United States": "US",
  "Viet Nam": "VN",
  "United Kingdom": "GB",
  "Japan": "JP",
  "Mexico": "MX",
  "France": "FR",
  "Spain": "ES",
  "Italy": "IT",
  "Australia": "AU",
  "Brazil": "BR",
  "China": "CN",
  "South Korea": "KR",
  "Netherlands": "NL",
  "Sweden": "SE",
  "Poland": "PL",
  "Belgium": "BE",
  "Norway": "NO",
  "Denmark": "DK",
  "Finland": "FI",
  "Portugal": "PT",
  "Argentina": "AR",
  "Chile": "CL",
  "Colombia": "CO",
  "Peru": "PE",
  "New Zealand": "NZ",
  "South Africa": "ZA",
  "India": "IN",
  "Turkey": "TR",
  "Saudi Arabia": "SA",
  "United Arab Emirates": "AE",
  "Singapore": "SG",
  "Malaysia": "MY",
  "Thailand": "TH",
  "Indonesia": "ID",
  "Philippines": "PH",
  "Taiwan": "TW",
  "Hong Kong": "HK",
  "Ireland": "IE",
  "Greece": "GR",
  "Hungary": "HU",
  "Romania": "RO",
  "Ukraine": "UA",
  "Israel": "IL",
};

const getCountryCode = (name: string): string => {
  return countryNameToCode[name] || name;
};

const parseUnityPeriod = (dateStr: string) => {
  if (!dateStr) return 'Unknown';
  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };
  const match = dateStr.match(/([A-Z][a-z]{2}) \d{2} (\d{4})/);
  if (match) {
    return `${match[2]}-${months[match[1]]}`;
  }
  return 'Unknown';
};

const parseCurrency = (val: string) => {
  if (!val) return 0;
  return parseFloat(val.replace(/[$,"]/g, ''));
};

export const parseCSV = (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        return reject(new Error("Empty file"));
      }

      const lines = text.split('\n');
      const isSteam = lines[0].trim() === 'sep=,' || text.includes('Steam Sales by Country');
      const isUnity = lines[0].includes('Package name,Price,Qty,Refunds,Chargebacks');

      if (isUnity) {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const rows: SalesRow[] = results.data.map((row: any) => {
                const title = row['Package name'] || 'Unknown';
                const units = parseInt(row['Qty'] || '0', 10);
                const refunds = parseInt(row['Refunds'] || '0', 10);
                const chargebacks = parseInt(row['Chargebacks'] || '0', 10);
                const refundUnits = refunds + chargebacks;
                
                const price = parseCurrency(row['Price'] || '0');
                const grossUSD = parseCurrency(row['Gross'] || '0');
                const refundUSD = refundUnits * price;
                const netUSD = grossUSD * 0.7; // Assuming 30% cut for Unity

                return {
                  title,
                  country: 'Unknown',
                  units,
                  grossUSD,
                  netUSD,
                  withholdingTaxUSD: 0,
                  period: parseUnityPeriod(row['Last']),
                  platform: 'Unity Asset Store',
                  refundUnits,
                  refundUSD,
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
          error: (error) => reject(error),
        });
      } else if (isSteam) {
        // Find the period
        let period = 'Unknown';
        const periodLine = lines.find(l => l.includes('Steam Sales by Country for'));
        if (periodLine) {
          const match = periodLine.match(/for (\d{4}-\d{2})-\d{2} to/);
          if (match) {
            period = match[1];
          }
        }

        // Find the header line index
        const headerIndex = lines.findIndex(l => l.startsWith('Country,Sku,Platform'));
        if (headerIndex === -1) {
          return reject(new Error("Could not find Steam CSV headers"));
        }

        const csvData = lines.slice(headerIndex).join('\n');
        
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const rows: SalesRow[] = results.data.map((row: any) => {
                // Extract title from Sku (e.g. "ParaLily (394497)" -> "ParaLily")
                let title = row['Sku'] || 'Unknown';
                title = title.replace(/\s*\(\d+\)$/, '');

                const netUSD = parseFloat(row['Net Steam Sales (USD)'] || '0');
                const grossUSD = netUSD / 0.7; // Assuming 30% cut

                return {
                  title,
                  country: getCountryCode(row['Country'] || 'Unknown'),
                  units: parseInt(row['Net Units Sold'] || '0', 10),
                  grossUSD,
                  netUSD,
                  withholdingTaxUSD: 0, // Not provided in this steam report format
                  period,
                  platform: row['Platform'] || 'Windows',
                  refundUnits: 0,
                  refundUSD: 0,
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
          error: (error) => reject(error),
        });
      } else {
        // Parse as Console
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
                  platform: 'Console',
                  refundUnits: 0,
                  refundUSD: 0,
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
          error: (error) => reject(error),
        });
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
