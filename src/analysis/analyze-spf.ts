import type { EmailFinding } from '../types.js';

export function analyzeSpf(records: string[]): EmailFinding[] {
  const f: EmailFinding[] = [];
  const spf = records.find((r) => r.startsWith('v=spf1'));
  if (!spf) {
    f.push({ severity: 'medium', id: 'no-spf', message: 'No SPF TXT record' });
    return f;
  }
  if (spf.includes('+all') || spf.match(/\s\+all/)) {
    f.push({
      severity: 'critical',
      id: 'spf-pass-all',
      message: 'SPF allows +all — spoofing risk',
    });
  }
  if (spf.includes('~all')) {
    f.push({ severity: 'low', id: 'spf-softfail', message: 'SPF ends with ~all (softfail)' });
  }
  return f;
}
