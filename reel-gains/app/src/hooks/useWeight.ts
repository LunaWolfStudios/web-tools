import { useStore } from '../store/useStore';

export function useWeight() {
  const { settings } = useStore();
  
  const formatWeight = (weight: number | undefined) => {
    if (weight === undefined || weight === null) return '-';
    
    // We assume data is stored in KG. 
    // If unit is LBS, we convert.
    if (settings.unit === 'lbs') {
      return `${Math.round(weight * 2.20462)} lbs`;
    }
    
    return `${weight} kg`;
  };

  const toDisplay = (weight: number | undefined) => {
    if (weight === undefined || weight === null) return '';
    if (settings.unit === 'lbs') {
      return Math.round(weight * 2.20462);
    }
    return weight;
  };

  const fromDisplay = (displayWeight: number) => {
    if (settings.unit === 'lbs') {
      return displayWeight / 2.20462;
    }
    return displayWeight;
  };

  return { unit: settings.unit, formatWeight, toDisplay, fromDisplay };
}
