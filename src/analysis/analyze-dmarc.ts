import type { EmailFinding } from '../types.js';

export function analyzeDmarc(records: string[]): EmailFinding[] {
  const f: EmailFinding[] = [];
  const dmarc = records.find((r) => r.startsWith('v=DMARC1'));
  if (!dmarc) {
    f.push({ severity: 'high', id: 'no-dmarc', message: 'No DMARC policy at _dmarc' });
    return f;
  }
  if (/p=none/i.test(dmarc)) {
    f.push({ severity: 'medium', id: 'dmarc-none', message: 'DMARC p=none — monitoring only' });
  }
  if (/p=reject/i.test(dmarc)) {
    f.push({ severity: 'info', id: 'dmarc-reject', message: 'DMARC p=reject (strong)' });
  }
  return f;
}
