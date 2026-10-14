import { queryOptions } from '@tanstack/react-query';
import type { ApiError, ResearchData, ResearchProvider } from './models';
import { mockProvider } from './mock-provider';
export class ResearchApiClient implements ResearchProvider {
 constructor(private readonly baseUrl: string) {}
 async getResearch(): Promise<ResearchData> {
  const response = await fetch(`${this.baseUrl.replace(/\/$/, '')}/research`);
  if(!response.ok) { const error: ApiError = {code:String(response.status),message:'Research data could not be loaded.',retryable:response.status>=500}; throw error; }
  return response.json() as Promise<ResearchData>;
 }
}
// Explicit opt-in: demonstration data remains the default until a backend is configured.
const baseUrl = import.meta.env['VITE_RESEARCH_API_BASE_URL'];
export const dataProvider: ResearchProvider = baseUrl ? new ResearchApiClient(baseUrl) : mockProvider;
export const researchQuery = queryOptions({queryKey:['research'],queryFn:()=>dataProvider.getResearch(),staleTime:60_000});
export function pageHead(title: string) { const description = `${title} for Indian equity markets. Quant Compass research workspace with clearly labeled demonstration data.`; return {meta:[{title:`${title} · Quant Compass`},{name:'description',content:description},{property:'og:title',content:`${title} · Quant Compass`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}; }
