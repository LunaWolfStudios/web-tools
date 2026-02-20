import { useStore } from '../store/useStore';

export function useWeight(weight: number | undefined) {
  const { settings } = useStore();
  
  if (weight === undefined) return { value: 0, unit: settings.units };

  if (settings.units === 'lb') {
    return {
      value: Math.round(weight * 2.20462),
      unit: 'lb'
    };
  }

  return {
    value: weight,
    unit: 'kg'
  };
}

export function toKg(weight: number, unit: 'kg' | 'lb') {
  if (unit === 'lb') {
    return Math.round(weight / 2.20462);
  }
  return weight;
}
