export interface ICoin {
  s: string;
  c: string;
  v: string;
}
export interface DataItem {
  symbol: string;
  volume: string;
  lastPrice: string;
  prev?: DataItem;
}
export interface SortBy {
  type: 'volume' | 'lastPrice';
  order: 'asc' | 'desc';
}
