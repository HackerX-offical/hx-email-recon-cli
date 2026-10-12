import type { EmailIntelReport } from '../types.js';

export function reportToJson(report: EmailIntelReport): string {
  return JSON.stringify(report, null, 2);
}
