import { PerformanceEntry } from 'react-native-performance';

import { InteractionManager } from 'react-native';
import { TimeRange } from '../components/chart/CryptoLineGraph';
export const getNativeMarkPerformanceLogs = (list: PerformanceEntry[]) => {
  if (!list) {
    return [];
  }
  let visited: any = {};
  let nativeMarkPerformanceObj: any = {};
  let nativeMarkPerformanceList = [];
  const n = list.length;
  for (let i = 0; i < n; i++) {
    nativeMarkPerformanceObj[list[i].name] = list[i].startTime;
  }

  for (let i = 0; i < n; i++) {
    if (!list[i].name) {
      continue;
    }
    const str = list[i].name;
    let prefix = '';
    if (str.includes('Start')) {
      prefix = str.replace('Start', '');
    } else if (str.includes('End')) {
      prefix = str.replace('End', '');
    }
    if (
      prefix &&
      prefix !== '' &&
      !visited[prefix] &&
      nativeMarkPerformanceObj[`${prefix}Start`] &&
      nativeMarkPerformanceObj[`${prefix}End`]
    ) {
      visited[prefix] = true;
      nativeMarkPerformanceList.push(
        `${
          nativeMarkPerformanceObj[`${prefix}End`] -
          nativeMarkPerformanceObj[`${prefix}Start`]
        }ms : ${prefix} Duration `
      );
    }
  }

  return nativeMarkPerformanceList;
};

export const throttle = (func: Function, delay) => {
  let throttling = false;

  return function (...args: any) {
    if (!throttling) {
      func.apply(this, args);

      throttling = true;

      setTimeout(() => {
        throttling = false;
      }, delay);
    }
  };
};
export function generateHourlyLabels(data: any): string[] {
  const labels: string[] = [];

  const startDate = new Date(data[0][0]);
  let endDate = new Date(data[data.length - 1][0]);
  const currentDate = new Date(startDate);
  while (startDate <= endDate) {
    labels.push(
      endDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
    endDate.setHours(endDate.getHours() - 1);
  }
  return labels.reverse();
}
export function generateDailyLabels(data: any[], months = 1): string[] {
  const labels = [];
  const dateFormat = new Intl.DateTimeFormat('en-US', { day: 'numeric' });

  for (const item of data) {
    const date = new Date(item[0]);
    labels.push(dateFormat.format(date));
  }

  return labels;
}
export function generateLabelsForAMonthDayWise(data: any[]): string[] {
  const labels = [];
  const dateFormat = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
  });
  const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short' });
  let prev = null;

  for (let i = data.length - 1; i >= 0; i -= 4) {
    const date = new Date(data[i][0]);
    const curr = date;

    if (prev !== null && curr.getDate() > prev.getDate()) {
      labels.push(monthFormat.format(date));
    }
    labels.push(dateFormat.format(date));
    prev = curr;
  }

  return labels.reverse();
}
export function generateMonthlyLabels(data: any[]): string[] {
  const labels = [];
  const dateFormat = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
  });
  const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short' });
  let prev = null;

  for (let i = data.length - 1; i >= 0; i -= 20) {
    const date = new Date(data[i][0]);
    const curr = date;

    if (prev !== null && curr.getDate() > prev.getDate()) {
      labels.push(monthFormat.format(date));
    }
    labels.push(dateFormat.format(date));
    prev = curr;
  }

  return labels.reverse();
}
export function generateYearToDateLabels(data: any[]): string[] {
  const labels = [];

  const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short' });
  const yearFormat = new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
  });
  let prev = null;

  for (let i = data.length - 1; i >= 0; i -= 30) {
    const date = new Date(data[i][0]);
    const curr = date;

    if (prev !== null && curr.getMonth() > prev.getMonth()) {
      labels.push(yearFormat.format(date));
    }
    labels.push(monthFormat.format(date));

    prev = curr;
  }

  return labels.reverse();
}

export function generateYearlyLabels(data: any[], magic = 30): string[] {
  const labels = [];

  const yearFormat = new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
  });
  let prev = null;

  for (let i = data.length - 1; i >= 0; i -= magic) {
    const date = new Date(data[i][0]);
    labels.push(yearFormat.format(date));
  }

  return labels.reverse();
}

export function generateAllTimeLabels(data: any[]): string[] {
  return generateYearlyLabels(data, 10);
}

export let COINS = [];
export const getDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

export function getIntervalandLimit(timeRange: TimeRange) {
  let interval = '1d'; // Default interval for most time ranges
  let limit = 365; // Default limit for most time ranges

  switch (timeRange) {
    case TimeRange.TODAY:
      limit = 1440; // Fetch data for the last 24 hours (1 minute intervals)
      interval = '1m';
      break;
    case TimeRange.WEEK:
      limit = 7; // Fetch data for the last 7 days
      interval = '1d';
      break;
    case TimeRange.ONE_MONTH:
      limit = 30; // Fetch data for the last 30 days
      interval = '1d';
      break;
    case TimeRange.SIX_MONTH:
      limit = 180; // Fetch data for the last 6 months
      interval = '1d';
      break;
    case TimeRange.YEAR_TO_DATE:
      const currentDate = new Date();
      const yearStart = new Date(currentDate.getFullYear(), 0, 1);
      const daysPassed = Math.floor(
        (currentDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)
      );
      limit = daysPassed + 1; // Fetch data from the start of the year till today
      interval = '1d';
      break;
    case TimeRange.ONE_YEAR:
      limit = 365; // Fetch data for the last 1 year
      interval = '1d';
      break;
    case TimeRange.FIVE_YEARS:
      limit = 365 * 5; // Fetch data for the last 5 years
      interval = '1w';
      break;
    case TimeRange.ALL_TIME:
      limit = 1000; // Fetch all available data
      interval = '1M';
      break;
    default:
      break;
  }
  return { interval, limit };
}

export function getLabels(timeRange: TimeRange, data) {
  let labels: any = [];

  switch (timeRange) {
    case TimeRange.TODAY:
      labels = generateHourlyLabels(data);
      break;
    case TimeRange.WEEK:
      labels = generateDailyLabels(data);
      break;
    case TimeRange.ONE_MONTH:
      labels = generateLabelsForAMonthDayWise(data);
      break;
    case TimeRange.SIX_MONTH:
      labels = generateMonthlyLabels(data);
      break;
    case TimeRange.YEAR_TO_DATE:
      labels = generateYearToDateLabels(data);
      break;
    case TimeRange.ONE_YEAR:
      labels = generateYearToDateLabels(data);
      break;
    case TimeRange.FIVE_YEARS:
      labels = generateYearlyLabels(data);
      break;
    case TimeRange.ALL_TIME:
      labels = generateAllTimeLabels(data);
      break;
    default:
      break;
  }
  return labels;
}
