import { SalesRow } from '../types';

export const aggregateTotals = (rows: SalesRow[]) => {
  return rows.reduce(
    (acc, row) => {
      acc.units += row.units;
      acc.grossUSD += row.grossUSD;
      acc.netUSD += row.netUSD;
      acc.withholdingTaxUSD += row.withholdingTaxUSD;
      return acc;
    },
    { units: 0, grossUSD: 0, netUSD: 0, withholdingTaxUSD: 0 }
  );
};

export const aggregateByPeriod = (rows: SalesRow[]) => {
  const grouped = rows.reduce((acc, row) => {
    if (!acc[row.period]) {
      acc[row.period] = { period: row.period, units: 0, grossUSD: 0, netUSD: 0 };
    }
    acc[row.period].units += row.units;
    acc[row.period].grossUSD += row.grossUSD;
    acc[row.period].netUSD += row.netUSD;
    return acc;
  }, {} as Record<string, { period: string; units: number; grossUSD: number; netUSD: number }>);

  return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));
};

export const aggregateByTitle = (rows: SalesRow[]) => {
  const grouped = rows.reduce((acc, row) => {
    if (!acc[row.title]) {
      acc[row.title] = { title: row.title, units: 0, grossUSD: 0, netUSD: 0 };
    }
    acc[row.title].units += row.units;
    acc[row.title].grossUSD += row.grossUSD;
    acc[row.title].netUSD += row.netUSD;
    return acc;
  }, {} as Record<string, { title: string; units: number; grossUSD: number; netUSD: number }>);

  return Object.values(grouped).sort((a, b) => b.grossUSD - a.grossUSD);
};

export const aggregateByCountry = (rows: SalesRow[]) => {
  const grouped = rows.reduce((acc, row) => {
    if (!acc[row.country]) {
      acc[row.country] = { country: row.country, units: 0, grossUSD: 0, netUSD: 0 };
    }
    acc[row.country].units += row.units;
    acc[row.country].grossUSD += row.grossUSD;
    acc[row.country].netUSD += row.netUSD;
    return acc;
  }, {} as Record<string, { country: string; units: number; grossUSD: number; netUSD: number }>);

  return Object.values(grouped).sort((a, b) => b.grossUSD - a.grossUSD);
};
