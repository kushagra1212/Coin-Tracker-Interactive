import { PerformanceEntry } from 'react-native-performance';

import { InteractionManager } from 'react-native';
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

export const throttle = (func, delay) => {
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
// export const COINS = [
//   {
//     symbol: 'BTCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ETHUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BNBUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BCCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NEOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LTCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'QTUMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ADAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XRPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'EOSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TUSDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'IOTAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XLMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ONTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TRXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ETCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ICXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'VENUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NULSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'VETUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PAXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BCHABCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BCHSVUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'USDCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LINKUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'WAVESUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BTTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'USDSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ONGUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'HOTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ZILUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ZRXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FETUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BATUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XMRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ZECUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'IOSTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CELRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DASHUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NANOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'OMGUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'THETAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ENJUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MITHUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MATICUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ATOMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TFUELUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ONEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FTMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ALGOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'USDSBUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GTOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ERDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DOGEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DUSKUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ANKRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'WINUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'COSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NPXSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'COCOSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MTLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TOMOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PERLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DENTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MFTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'KEYUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'STORMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DOCKUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'WANUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FUNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CVCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CHZUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BANDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BUSDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BEAMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XTZUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RENUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RVNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'HCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'HBARUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NKNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'STXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'KAVAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ARPAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'IOTXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RLCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MCOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CTXCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BCHUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TROYUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'VITEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FTTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'EURUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'OGNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DREPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BULLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BEARUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ETHBULLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ETHBEARUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TCTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'WRXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BTSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LSKUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BNTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LTOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'EOSBULLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'EOSBEARUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XRPBULLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XRPBEARUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'STRATUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AIONUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MBLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'COTIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BNBBULLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BNBBEARUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'STPTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'WTCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DATAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XZCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SOLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CTSIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'HIVEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CHRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BTCUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BTCDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GXSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ARDRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LENDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MDTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'STMXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'KNCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'REPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LRCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PNTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'COMPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BKRWUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ZENUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SNXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ETHUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ETHDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ADAUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ADADOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LINKUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LINKDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'VTHOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DGBUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GBPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SXPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MKRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DAIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DCRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'STORJUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BNBUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BNBDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XTZUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XTZDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MANAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AUDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'YFIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BALUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BLZUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'IRISUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'KMDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'JSTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SRMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ANTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CRVUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SANDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'OCEANUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NMRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DOTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LUNAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RSRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PAXGUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'WNXMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TRBUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BZRXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SUSHIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'YFIIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'KSMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'EGLDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DIAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RUNEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FIOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'UMAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'EOSUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'EOSDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TRXUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TRXDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XRPUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XRPDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DOTUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DOTDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BELUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'WINGUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LTCUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LTCDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'UNIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NBSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'OXTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SUNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AVAXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'HNTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FLMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'UNIUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'UNIDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ORNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'UTKUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XVSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ALPHAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AAVEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NEARUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SXPUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SXPDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FILUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FILUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FILDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'YFIUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'YFIDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'INJUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AUDIOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CTKUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BCHUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BCHDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AKROUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AXSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'HARDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DNTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'STRAXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'UNFIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ROSEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AVAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XEMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AAVEUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AAVEDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SKLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SUSDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SUSHIUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SUSHIDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XLMUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XLMDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GRTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'JUVUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PSGUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: '1INCHUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'REEFUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'OGUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ATMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ASRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CELOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RIFUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BTCSTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TRUUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CKBUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TWTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FIROUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LITUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SFPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DODOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CAKEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ACMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BADGERUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FISUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'OMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PONDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DEGOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ALICEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LINAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PERPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RAMPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SUPERUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CFXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'EPSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AUTOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TKOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PUNDIXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TLMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: '1INCHUPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: '1INCHDOWNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BTGUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MIRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BARUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FORTHUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BAKEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BURGERUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SLPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SHIBUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ICPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ARUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'POLSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MDXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MASKUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LPTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NUUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XVGUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ATAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GTCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TORNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'KEEPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ERNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'KLAYUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PHAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BONDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MLNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DEXEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'C98USDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CLVUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'QNTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FLOWUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TVKUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MINAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RAYUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FARMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ALPACAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'QUICKUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MBOXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FORUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'REQUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GHSTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'WAXPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TRIBEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GNOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XECUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ELFUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DYDXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'POLYUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'IDEXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'VIDTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'USDPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GALAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ILVUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'YGGUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SYSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DFUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FIDAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FRONTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CVPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AGLDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RADUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BETAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RAREUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LAZIOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CHESSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ADXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AUCTIONUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'DARUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BNXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RGTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MOVRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CITYUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ENSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'KP3RUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'QIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PORTOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'POWRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'VGXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'JASMYUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AMPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PLAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PYRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RNDRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ALCXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SANTOSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ANYUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BICOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FLUXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FXSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'VOXELUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'HIGHUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'CVXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PEOPLEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'OOKIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SPELLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'USTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'JOEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ACHUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'IMXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GLMRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LOKAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SCRTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'API3USDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BTTCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ACAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ANCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'XNOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'WOOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ALPINEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'TUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ASTRUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NBTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GMTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'KDAUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'APEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BSWUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BIFIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MULTIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'STEEMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MOBUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NEXOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'REIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GALUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LDOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'EPXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'OPUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LEVERUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'STGUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LUNCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GMXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'NEBLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'POLYXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'APTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'OSMOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'HFTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PHBUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'HOOKUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'MAGICUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'HIFIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RPLUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PROSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AGIXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GNSUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SYNUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'VIBUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SSVUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LQTYUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AMBUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'BETHUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'USTCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GASUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'GLMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PROMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'QKCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'UFTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'IDUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ARBUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'LOOMUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'OAXUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'RDNTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'WBTCUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'EDUUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SUIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'AERGOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'PEPEUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'FLOKIUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'ASTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'SNTUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
//   {
//     symbol: 'COMBOUSDT',
//     lastPrice: '0',
//     volume: '0',
//   },
// ];
