import { describe, expect, it } from 'vitest';
import { mockProvider } from './mock-provider';
describe('demonstration data contract',()=>{it('identifies research as mock, not live data',async()=>{const data=await mockProvider.getResearch();expect(data.quality).toBe('mock');expect(data.timestamp).toBe('30 Sep 2026, 15:30 IST');});});
