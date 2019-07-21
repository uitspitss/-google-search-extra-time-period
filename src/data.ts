import dayjs from 'dayjs';
import chromep from 'chrome-promise';

export type TimePeriod = {
  value: number;
  unit: string;
};

export type TimePeriods = TimePeriod[];

type TimeUnits = {
  day: number;
  week: number;
  month: number;
  year: number;
  [key: string]: number;
};

const timeUnits = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
} as TimeUnits;

export const getTimePeriods = async () => {
  const result = await chromep.storage.sync.get('extraTimePeriods');
  const timePeriods = result.extraTimePeriods ? result.extraTimePeriods : [];
  return timePeriods;
};

export const setTimePeriods = async (timePeriods: TimePeriods) => {
  await chromep.storage.sync.set({ extraTimePeriods: timePeriods });
  return await getTimePeriods();
};

export const addTimePeriod = async ({ value, unit }: TimePeriod) => {
  const timePeriods = await getTimePeriods();
  for (let tp of timePeriods) {
    if (tp.value === value && tp.unit === unit) {
      return timePeriods;
    }
  }
  timePeriods.push({ value: value, unit: unit });
  timePeriods.sort((a: TimePeriod, b: TimePeriod) => {
    const aPeriod = a.value * timeUnits[a.unit];
    const bPeriod = b.value * timeUnits[b.unit];
    return aPeriod - bPeriod;
  });
  await chromep.storage.sync.set({ extraTimePeriods: timePeriods });
  return timePeriods;
};

export const removeTimePeriod = async ({ value, unit }: TimePeriod) => {
  const timePeriods = await getTimePeriods();
  const newTimePeriods = timePeriods.filter(
    (tp: TimePeriod) => tp.value !== value || tp.unit !== unit,
  );
  return await setTimePeriods(newTimePeriods);
};
