export interface SalesRow {
  title: string;
  country: string;
  units: number;
  grossUSD: number;
  netUSD: number;
  withholdingTaxUSD: number;
  period: string; // YYYY-MM
}

export interface Dataset {
  id: string;
  name: string;
  uploadDate: number;
  rows: SalesRow[];
}
