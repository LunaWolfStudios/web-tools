/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Upload, FileText, Trash2, Filter, BarChart3, LineChart, DollarSign, Package, PackageMinus } from 'lucide-react';
import { Dataset, SalesRow } from './types';
import { parseCSV } from './lib/parser';
import { aggregateTotals, aggregateByPeriod, aggregateByTitle, aggregateByCountry, aggregateByPlatform } from './lib/aggregations';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function App() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<Set<string>>(new Set());
  const [selectedTitles, setSelectedTitles] = useState<Set<string>>(new Set());
  const [selectedPeriods, setSelectedPeriods] = useState<Set<string>>(new Set());
  const [selectedYears, setSelectedYears] = useState<Set<string>>(new Set());
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [revenueType, setRevenueType] = useState<'grossUSD' | 'netUSD'>('grossUSD');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDatasets: Dataset[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const dataset = await parseCSV(files[i]);
        newDatasets.push(dataset);
      } catch (err) {
        console.error('Error parsing CSV:', err);
      }
    }

    setDatasets(prev => {
      const combined = [...prev, ...newDatasets];
      // Auto-select newly added datasets
      setSelectedDatasetIds(new Set(combined.map(d => d.id)));
      return combined;
    });
    
    // Reset file input
    event.target.value = '';
  };

  const removeDataset = (id: string) => {
    setDatasets(prev => prev.filter(d => d.id !== id));
    setSelectedDatasetIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleDataset = (id: string) => {
    setSelectedDatasetIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTitle = (title: string) => {
    setSelectedTitles(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const togglePeriod = (period: string) => {
    setSelectedPeriods(prev => {
      const next = new Set(prev);
      if (next.has(period)) next.delete(period);
      else next.add(period);
      return next;
    });
  };

  const toggleYear = (year: string) => {
    setSelectedYears(prev => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => {
      const next = new Set(prev);
      if (next.has(country)) next.delete(country);
      else next.add(country);
      return next;
    });
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  };

  // Combine rows from selected datasets
  const allSelectedRows = useMemo(() => {
    return datasets
      .filter(d => selectedDatasetIds.has(d.id))
      .flatMap(d => d.rows);
  }, [datasets, selectedDatasetIds]);

  // Extract unique filter options
  const availableTitles = useMemo(() => {
    return Array.from(new Set(allSelectedRows.map(r => r.title))).sort();
  }, [allSelectedRows]);

  const availablePeriods = useMemo(() => {
    return Array.from(new Set(allSelectedRows.map(r => r.period))).sort();
  }, [allSelectedRows]);

  const availableYears = useMemo(() => {
    return Array.from(new Set(allSelectedRows.map(r => r.period.substring(0, 4)))).sort();
  }, [allSelectedRows]);

  const availableCountries = useMemo(() => {
    return Array.from(new Set(allSelectedRows.map(r => r.country))).sort();
  }, [allSelectedRows]);

  const availablePlatforms = useMemo(() => {
    return Array.from(new Set(allSelectedRows.map(r => r.platform))).sort();
  }, [allSelectedRows]);

  // Apply filters
  const filteredRows = useMemo(() => {
    return allSelectedRows.filter(row => {
      const titleMatch = selectedTitles.size === 0 || selectedTitles.has(row.title);
      const periodMatch = selectedPeriods.size === 0 || selectedPeriods.has(row.period);
      const yearMatch = selectedYears.size === 0 || selectedYears.has(row.period.substring(0, 4));
      const countryMatch = selectedCountries.size === 0 || selectedCountries.has(row.country);
      const platformMatch = selectedPlatforms.size === 0 || selectedPlatforms.has(row.platform);
      return titleMatch && periodMatch && yearMatch && countryMatch && platformMatch;
    });
  }, [allSelectedRows, selectedTitles, selectedPeriods, selectedYears, selectedCountries, selectedPlatforms]);

  // Compute aggregations
  const totals = useMemo(() => aggregateTotals(filteredRows), [filteredRows]);
  const periodData = useMemo(() => aggregateByPeriod(filteredRows), [filteredRows]);
  const titleData = useMemo(() => aggregateByTitle(filteredRows), [filteredRows]);
  const countryData = useMemo(() => aggregateByCountry(filteredRows), [filteredRows]);
  const platformData = useMemo(() => aggregateByPlatform(filteredRows), [filteredRows]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neon-text-blue flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Luna Ledger
          </h1>
          <p className="text-gray-400 mt-1">Sales Analytics Dashboard</p>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="neon-button-blue cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload CSV
            <input 
              type="file" 
              accept=".csv" 
              multiple 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>
      </header>

      {datasets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center glass-panel p-12 text-center min-h-[400px]">
          <FileText className="w-16 h-16 text-gray-500 mb-4" />
          <h2 className="text-xl font-medium text-gray-300 mb-2">No Datasets Uploaded</h2>
          <p className="text-gray-500 mb-6 max-w-md">Upload one or more sales CSV files to begin analyzing your data.</p>
          <label className="neon-button-blue cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload CSV
            <input 
              type="file" 
              accept=".csv" 
              multiple 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
            {/* Filters */}
            <div className="glass-panel p-5 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h3>
                {(selectedTitles.size > 0 || selectedPeriods.size > 0 || selectedYears.size > 0 || selectedCountries.size > 0 || selectedPlatforms.size > 0) && (
                  <button 
                    onClick={() => { setSelectedTitles(new Set()); setSelectedPeriods(new Set()); setSelectedYears(new Set()); setSelectedCountries(new Set()); setSelectedPlatforms(new Set()); }}
                    className="text-xs text-neon-blue hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div>
                <h4 className="text-xs text-gray-500 mb-2 font-medium">PRODUCT</h4>
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {availableTitles.map(title => (
                    <label key={title} className="flex items-center gap-2 cursor-pointer text-sm hover:bg-white/5 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedTitles.has(title)}
                        onChange={() => toggleTitle(title)}
                        className="accent-neon-blue w-3.5 h-3.5"
                      />
                      <span className="truncate">{title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs text-gray-500 mb-2 font-medium">PLATFORM</h4>
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {availablePlatforms.map(platform => (
                    <label key={platform} className="flex items-center gap-2 cursor-pointer text-sm hover:bg-white/5 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedPlatforms.has(platform)}
                        onChange={() => togglePlatform(platform)}
                        className="accent-neon-purple w-3.5 h-3.5"
                      />
                      <span className="truncate">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs text-gray-500 mb-2 font-medium">YEAR</h4>
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {availableYears.map(year => (
                    <label key={year} className="flex items-center gap-2 cursor-pointer text-sm hover:bg-white/5 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedYears.has(year)}
                        onChange={() => toggleYear(year)}
                        className="accent-neon-green w-3.5 h-3.5"
                      />
                      <span className="truncate">{year}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs text-gray-500 mb-2 font-medium">SALES PERIOD</h4>
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {availablePeriods.map(period => (
                    <label key={period} className="flex items-center gap-2 cursor-pointer text-sm hover:bg-white/5 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedPeriods.has(period)}
                        onChange={() => togglePeriod(period)}
                        className="accent-neon-green w-3.5 h-3.5"
                      />
                      <span>{period}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs text-gray-500 mb-2 font-medium">COUNTRY</h4>
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {availableCountries.map(country => (
                    <label key={country} className="flex items-center gap-2 cursor-pointer text-sm hover:bg-white/5 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedCountries.has(country)}
                        onChange={() => toggleCountry(country)}
                        className="accent-neon-blue w-3.5 h-3.5"
                      />
                      <span className="truncate">{country}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Datasets */}
            <div className="glass-panel p-5">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Datasets
              </h3>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {datasets.map(dataset => (
                  <div key={dataset.id} className="flex items-center justify-between bg-black/30 p-2 rounded border border-white/5">
                    <label className="flex items-center gap-2 cursor-pointer overflow-hidden">
                      <input 
                        type="checkbox" 
                        checked={selectedDatasetIds.has(dataset.id)}
                        onChange={() => toggleDataset(dataset.id)}
                        className="accent-neon-blue w-4 h-4"
                      />
                      <span className="text-sm truncate" title={dataset.name}>{dataset.name}</span>
                    </label>
                    <button 
                      onClick={() => removeDataset(dataset.id)}
                      className="text-gray-500 hover:text-red-400 p-1"
                      title="Remove dataset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col gap-6 w-full min-w-0">
            
            {/* KPI Cards */}
            <div className={`grid grid-cols-2 ${totals.refundUnits > 0 ? 'md:grid-cols-6' : 'md:grid-cols-5'} gap-4`}>
              <div className="glass-panel p-5 flex flex-col">
                <span className="text-gray-400 text-sm font-medium flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-neon-blue" /> Total Units
                </span>
                <span className="text-3xl font-bold neon-text-blue">{formatNumber(totals.units)}</span>
              </div>
              
              {totals.refundUnits > 0 && (
                <div className="glass-panel p-5 flex flex-col">
                  <span className="text-gray-400 text-sm font-medium flex items-center gap-2 mb-2">
                    <PackageMinus className="w-4 h-4 text-red-400" /> Total Refunds
                  </span>
                  <span className="text-2xl font-bold text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] leading-tight">
                    {formatNumber(totals.refundUnits)} <span className="text-lg opacity-80">({formatCurrency(totals.refundUSD)})</span>
                  </span>
                </div>
              )}

              <div className="glass-panel p-5 flex flex-col">
                <span className="text-gray-400 text-sm font-medium flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-neon-green" /> Gross Revenue
                </span>
                <span className="text-3xl font-bold neon-text-green">{formatCurrency(totals.grossUSD)}</span>
              </div>
              <div className="glass-panel p-5 flex flex-col">
                <span className="text-gray-400 text-sm font-medium flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-neon-purple" /> Net Revenue
                </span>
                <span className="text-3xl font-bold neon-text-purple">{formatCurrency(totals.netUSD)}</span>
              </div>
              <div className="glass-panel p-5 flex flex-col">
                <span className="text-gray-400 text-sm font-medium flex items-center gap-2 mb-2">
                  <LineChart className="w-4 h-4 text-gray-300" /> Avg Sale Price
                </span>
                <span className="text-3xl font-bold text-white">
                  {totals.units > 0 ? formatCurrency(totals.grossUSD / totals.units) : '$0.00'}
                </span>
              </div>
              <div className="glass-panel p-5 flex flex-col">
                <span className="text-gray-400 text-sm font-medium flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-red-400" /> Withholding Tax
                </span>
                <span className="text-3xl font-bold text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">{formatCurrency(totals.withholdingTaxUSD)}</span>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Revenue Over Time */}
              <div className="glass-panel p-5 flex flex-col min-h-[350px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Revenue Over Time</h3>
                  <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                    <button 
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${revenueType === 'grossUSD' ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => setRevenueType('grossUSD')}
                    >
                      Gross
                    </button>
                    <button 
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${revenueType === 'netUSD' ? 'bg-neon-purple/20 text-neon-purple' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => setRevenueType('netUSD')}
                    >
                      Net
                    </button>
                  </div>
                </div>
                <div className="flex-1 w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={periodData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="period" stroke="#888" tick={{fill: '#888'}} tickMargin={10} />
                      <YAxis 
                        stroke="#888" 
                        tick={{fill: '#888'}} 
                        tickFormatter={(value) => `$${value}`}
                        width={80}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#151520', borderColor: 'rgba(0,212,255,0.3)', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#00D4FF' }}
                        formatter={(value: number) => [formatCurrency(value), revenueType === 'grossUSD' ? 'Gross Revenue' : 'Net Revenue']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={revenueType} 
                        stroke={revenueType === 'grossUSD' ? '#00D4FF' : '#A855F7'} 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#0A0A0F', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: revenueType === 'grossUSD' ? '#00D4FF' : '#A855F7' }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Units Over Time */}
              <div className="glass-panel p-5 flex flex-col min-h-[350px]">
                <h3 className="text-lg font-semibold mb-6">Units Sold Over Time</h3>
                <div className="flex-1 w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={periodData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="period" stroke="#888" tick={{fill: '#888'}} tickMargin={10} />
                      <YAxis stroke="#888" tickFormatter={formatNumber} tick={{fill: '#888'}} width={60} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#151520', borderColor: 'rgba(0,240,255,0.3)', borderRadius: '8px', color: '#fff' }}
                        formatter={(value: number) => [formatNumber(value), 'Units Sold']}
                        labelStyle={{ color: '#888', marginBottom: '4px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="units" 
                        stroke="#00F0FF" 
                        strokeWidth={3}
                        dot={{ fill: '#0A0A0F', strokeWidth: 2, r: 4, stroke: '#00F0FF' }}
                        activeDot={{ r: 6, fill: '#00F0FF', stroke: '#fff' }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue by Product */}
              <div className="glass-panel p-5 flex flex-col min-h-[350px]">
                <h3 className="text-lg font-semibold mb-6">Revenue by Product</h3>
                <div className="flex-1 w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={titleData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#888" tickFormatter={(value) => `$${value}`} />
                      <YAxis dataKey="title" type="category" stroke="#888" width={100} tick={{fill: '#ccc', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#151520', borderColor: revenueType === 'grossUSD' ? 'rgba(0,212,255,0.3)' : 'rgba(168,85,247,0.3)', borderRadius: '8px', color: '#fff' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        formatter={(value: number) => [formatCurrency(value), revenueType === 'grossUSD' ? 'Gross Revenue' : 'Net Revenue']}
                      />
                      <Bar 
                        dataKey={revenueType} 
                        fill={revenueType === 'grossUSD' ? '#00D4FF' : '#A855F7'} 
                        radius={[0, 4, 4, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Units by Product */}
              <div className="glass-panel p-5 flex flex-col min-h-[350px]">
                <h3 className="text-lg font-semibold mb-6">Units by Product</h3>
                <div className="flex-1 w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={titleData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#888" tickFormatter={formatNumber} />
                      <YAxis dataKey="title" type="category" stroke="#888" width={100} tick={{fill: '#ccc', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#151520', borderColor: 'rgba(0,240,255,0.3)', borderRadius: '8px', color: '#fff' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        formatter={(value: number) => [formatNumber(value), 'Units Sold']}
                      />
                      <Bar 
                        dataKey="units" 
                        fill="#00F0FF" 
                        radius={[0, 4, 4, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue by Platform */}
              <div className="glass-panel p-5 flex flex-col min-h-[350px]">
                <h3 className="text-lg font-semibold mb-6">Revenue by Platform</h3>
                <div className="flex-1 w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#888" tickFormatter={(value) => `$${value}`} />
                      <YAxis dataKey="platform" type="category" stroke="#888" width={80} tick={{fill: '#ccc', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#151520', borderColor: revenueType === 'grossUSD' ? 'rgba(0,212,255,0.3)' : 'rgba(168,85,247,0.3)', borderRadius: '8px', color: '#fff' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        formatter={(value: number) => [formatCurrency(value), revenueType === 'grossUSD' ? 'Gross Revenue' : 'Net Revenue']}
                      />
                      <Bar 
                        dataKey={revenueType} 
                        fill={revenueType === 'grossUSD' ? '#00D4FF' : '#A855F7'} 
                        radius={[0, 4, 4, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue by Country */}
              <div className="glass-panel p-5 flex flex-col min-h-[350px]">
                <h3 className="text-lg font-semibold mb-6">Revenue by Country</h3>
                <div className="flex-1 w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#888" tickFormatter={(value) => `$${value}`} />
                      <YAxis dataKey="country" type="category" stroke="#888" width={60} tick={{fill: '#ccc', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#151520', borderColor: 'rgba(0,255,156,0.3)', borderRadius: '8px', color: '#fff' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        formatter={(value: number) => [formatCurrency(value), revenueType === 'grossUSD' ? 'Gross Revenue' : 'Net Revenue']}
                      />
                      <Bar 
                        dataKey={revenueType} 
                        fill="#00FF9C" 
                        radius={[0, 4, 4, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Units Refunded Over Time */}
              {totals.refundUnits > 0 && (
                <div className="glass-panel p-5 flex flex-col min-h-[350px]">
                  <h3 className="text-lg font-semibold mb-6">Units Refunded Over Time</h3>
                  <div className="flex-1 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={periodData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="period" stroke="#888" tick={{fill: '#888'}} tickMargin={10} />
                        <YAxis stroke="#888" tickFormatter={formatNumber} tick={{fill: '#888'}} width={60} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#151520', borderColor: 'rgba(248,113,113,0.3)', borderRadius: '8px', color: '#fff' }}
                          formatter={(value: number) => [formatNumber(value), 'Units Refunded']}
                          labelStyle={{ color: '#888', marginBottom: '4px' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="refundUnits" 
                          stroke="#F87171" 
                          strokeWidth={3}
                          dot={{ fill: '#0A0A0F', strokeWidth: 2, r: 4, stroke: '#F87171' }}
                          activeDot={{ r: 6, fill: '#F87171', stroke: '#fff' }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}} />
    </div>
  );
}
