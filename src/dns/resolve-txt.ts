import dns from 'node:dns/promises';
import type { TxtResolver } from '../types.js';

export const defaultTxtResolver: TxtResolver = async (name) => {
  try {
    const rows = await dns.resolveTxt(name);
    return rows.map((r) => r.join(''));
  } catch {
    return [];
  }
};
