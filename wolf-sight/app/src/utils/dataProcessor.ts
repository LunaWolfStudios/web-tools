import { AggregatedData, FilterState, ProcessedEntry, RawEntry, RawLeaderboard } from '../types';
import { format, parseISO, getHours, getDay } from 'date-fns';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const findEntriesArray = (obj: any): any[] | null => {
  if (Array.isArray(obj)) {
    const valid = obj.filter(o => o && typeof o === 'object' && 'timestamp' in o && 'score' in o);
    if (valid.length > 0) return valid;
  }
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      const res = findEntriesArray(obj[key]);
      if (res) return res;
    }
  }
  return null;
};

export const parseLeaderboardFile = async (file: File): Promise<ProcessedEntry[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        const entriesArray = findEntriesArray(data);
        if (!entriesArray) {
          throw new Error('Invalid file format. Could not find an array of entries with timestamp and score.');
        }

        const processed = entriesArray.map((entry, index) => {
          const dateObj = parseISO(entry.timestamp);
          if (isNaN(dateObj.getTime())) {
            throw new Error(`Invalid timestamp format in entry ${index}: ${entry.timestamp}`);
          }
          return {
            ...entry,
            category: entry.category || 'Uncategorized',
            score: Number(entry.score),
            id: `${entry.timestamp}-${index}`,
            date: format(dateObj, 'yyyy-MM-dd'),
            hour: getHours(dateObj),
            dayOfWeek: DAYS_OF_WEEK[getDay(dateObj)],
            timestampMs: dateObj.getTime(),
          };
        });

        resolve(processed);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const applyFilters = (entries: ProcessedEntry[], filters: FilterState): ProcessedEntry[] => {
  return entries.filter((entry) => {
    const matchesDate = filters.dates.length === 0 || filters.dates.includes(entry.date);
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(entry.category);
    const matchesScore = entry.score >= filters.scoreRange[0] && entry.score <= filters.scoreRange[1];
    const matchesTime = entry.hour >= filters.timeRange[0] && entry.hour <= filters.timeRange[1];

    return matchesDate && matchesCategory && matchesScore && matchesTime;
  });
};

export const aggregateData = (entries: ProcessedEntry[], timeRange: [number, number] = [0, 23]): AggregatedData => {
  const playsPerHour: Record<number, number> = {};
  const playsPerCategory: Record<string, number> = {};
  const playsPerDay: Record<string, number> = {};
  const highestScorePerCategory: Record<string, number> = {};
  
  let totalScore = 0;
  let highestScoreOverall = 0;

  // Initialize hours within timeRange
  for (let i = timeRange[0]; i <= timeRange[1]; i++) playsPerHour[i] = 0;

  entries.forEach((entry) => {
    // Plays per hour
    playsPerHour[entry.hour] = (playsPerHour[entry.hour] || 0) + 1;
    
    // Plays per category
    playsPerCategory[entry.category] = (playsPerCategory[entry.category] || 0) + 1;
    
    // Plays per day
    playsPerDay[entry.date] = (playsPerDay[entry.date] || 0) + 1;

    // Highest score per category
    if (!highestScorePerCategory[entry.category] || entry.score > highestScorePerCategory[entry.category]) {
      highestScorePerCategory[entry.category] = entry.score;
    }

    // Overall metrics
    totalScore += entry.score;
    if (entry.score > highestScoreOverall) {
      highestScoreOverall = entry.score;
    }
  });

  const totalPlays = entries.length;
  const averageScore = totalPlays > 0 ? totalScore / totalPlays : 0;

  let busiestHour = timeRange[0];
  let slowestHour = timeRange[0];
  let maxPlays = -1;
  let minPlays = Infinity;

  Object.entries(playsPerHour).forEach(([hourStr, plays]) => {
    const hour = parseInt(hourStr, 10);
    if (plays > maxPlays) {
      maxPlays = plays;
      busiestHour = hour;
    }
    if (plays < minPlays) {
      minPlays = plays;
      slowestHour = hour;
    }
  });

  return {
    totalPlays,
    busiestHour,
    slowestHour,
    highestScoreOverall,
    highestScorePerCategory,
    averageScore,
    playsPerCategory,
    playsPerHour,
    playsPerDay,
  };
};

export const getAvailableFilters = (entries: ProcessedEntry[]) => {
  const dates = Array.from(new Set(entries.map(e => e.date))).sort();
  const categories = Array.from(new Set(entries.map(e => e.category))).sort();
  
  let minScore = Infinity;
  let maxScore = -Infinity;
  
  entries.forEach(e => {
    if (e.score < minScore) minScore = e.score;
    if (e.score > maxScore) maxScore = e.score;
  });

  if (minScore === Infinity) minScore = 0;
  if (maxScore === -Infinity) maxScore = 1000;

  return { dates, categories, minScore, maxScore };
};
