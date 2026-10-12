import type { ResearchData, ResearchProvider } from './models';
const instruments: ResearchData['instruments'] = [
{symbol:'RELIANCE',name:'Reliance Industries',sector:'Energy',exchange:'NSE',price:2934.65,change:1.24,marketCap:'19.85T',pe:28.4,score:87,volume:'8.42M'},
{symbol:'HDFCBANK',name:'HDFC Bank',sector:'Financials',exchange:'NSE',price:1682.30,change:0.86,marketCap:'12.78T',pe:19.2,score:91,volume:'12.61M'},
{symbol:'TCS',name:'Tata Consultancy Services',sector:'Technology',exchange:'NSE',price:4126.75,change:-0.42,marketCap:'14.93T',pe:31.6,score:84,volume:'2.18M'},
{symbol:'INFY',name:'Infosys Limited',sector:'Technology',exchange:'NSE',price:1864.20,change:1.82,marketCap:'7.73T',pe:27.1,score:89,volume:'6.74M'},
{symbol:'ICICIBANK',name:'ICICI Bank',sector:'Financials',exchange:'NSE',price:1248.50,change:1.46,marketCap:'8.82T',pe:18.7,score:93,volume:'9.38M'},
{symbol:'BHARTIARTL',name:'Bharti Airtel',sector:'Communication',exchange:'NSE',price:1623.80,change:2.13,marketCap:'9.24T',pe:42.3,score:86,volume:'4.52M'},
{symbol:'ITC',name:'ITC Limited',sector:'Consumer Staples',exchange:'NSE',price:486.35,change:-0.68,marketCap:'6.08T',pe:29.4,score:78,volume:'7.13M'},
{symbol:'LT',name:'Larsen & Toubro',sector:'Industrials',exchange:'NSE',price:3642.10,change:0.94,marketCap:'5.01T',pe:34.5,score:82,volume:'1.83M'},
{symbol:'SUNPHARMA',name:'Sun Pharmaceutical',sector:'Healthcare',exchange:'NSE',price:1792.40,change:1.64,marketCap:'4.30T',pe:37.2,score:88,volume:'2.63M'},
{symbol:'TATAMOTORS',name:'Tata Motors',sector:'Automobiles',exchange:'NSE',price:948.15,change:-1.12,marketCap:'3.49T',pe:12.8,score:75,volume:'10.27M'},
{symbol:'MARUTI',name:'Maruti Suzuki',sector:'Automobiles',exchange:'NSE',price:12546.80,change:0.52,marketCap:'3.94T',pe:26.8,score:81,volume:'0.72M'},
{symbol:'NTPC',name:'NTPC Limited',sector:'Utilities',exchange:'NSE',price:412.65,change:1.31,marketCap:'4.00T',pe:18.9,score:83,volume:'8.93M'},
];
const closes = [24418,24446,24420,24495,24470,24534,24500,24562,24541,24520,24585,24552,24622,24605,24587,24648,24610,24657,24623,24676,24635,24690,24672,24722,24692,24756,24719,24762,24740,24795,24760,24808,24784,24840,24820,24855,24813,24866,24830,24895,24865,24912,24887,24934,24920,24954,24920,24982,24958,24986,24970,25013,24987,25042,25011,25059,25032,25081,25052,25094];
export const mockData: ResearchData = {
 instruments,
 prices:closes.map((close,i)=>({date:`${9+Math.floor(i/3)} Sep`,close,benchmark:close-130-(i%7)*13,volume:1200000+(i%9)*130000})),
 factors:[{name:'Momentum',score:92,change:4},{name:'Quality',score:86,change:2},{name:'Value',score:74,change:-1},{name:'Low volatility',score:81,change:3},{name:'Growth',score:88,change:2}],
 indices:[{name:'NIFTY 50',symbol:'NSE',value:'25,094.15',change:'+186.55 (0.75%)',positive:true,points:[4,3,5,4,6,5,7,6,9,8,10,9,12]}, {name:'SENSEX',symbol:'BSE',value:'81,921.29',change:'+613.42 (0.75%)',positive:true,points:[3,5,4,6,5,7,6,8,7,10,9,12]}, {name:'NIFTY BANK',symbol:'NSE',value:'51,782.45',change:'+312.80 (0.61%)',positive:true,points:[4,3,4,6,5,7,6,8,6,9,10,12]}, {name:'INDIA VIX',symbol:'NSE',value:'13.24',change:'−0.48 (3.50%)',positive:false,points:[12,10,11,9,10,8,7,8,6,7,4,5]}],
 sectors:[{name:'Information Technology',change:1.82,advances:8,declines:2},{name:'Healthcare',change:1.64,advances:7,declines:3},{name:'Financial Services',change:1.28,advances:15,declines:5},{name:'Energy',change:0.94,advances:7,declines:3},{name:'Consumer Staples',change:0.42,advances:8,declines:7},{name:'Automobiles',change:-0.68,advances:4,declines:11}],
 timestamp:'30 Sep 2026, 15:30 IST',quality:'mock'
};
export const mockProvider: ResearchProvider = { async getResearch(){ return mockData; } };
