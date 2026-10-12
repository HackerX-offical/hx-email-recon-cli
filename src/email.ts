import dns from 'node:dns/promises';

export interface EmailIntelReport {
  domain: string;
  spf?: string[];
  dmarc?: string[];
  dkimSelectors: Array<{ selector: string; record?: string }>;
  findings: Array<{ severity: string; id: string; message: string }>;
}

const COMMON_DKIM = [
  'default',
  'google',
  'selector1',
  'selector2',
  'k1',
  's1',
  'smtp',
  'mail',
  'dkim',
];

async function txt(name: string): Promise<string[]> {
  try {
    const rows = await dns.resolveTxt(name);
    return rows.map((r) => r.join(''));
  } catch {
    return [];
  }
}

export function analyzeSpf(
  records: string[],
): Array<{ severity: string; id: string; message: string }> {
  const f: EmailIntelReport['findings'] = [];
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

export function analyzeDmarc(
  records: string[],
): Array<{ severity: string; id: string; message: string }> {
  const f: EmailIntelReport['findings'] = [];
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

export async function reconEmailDomain(domain: string): Promise<EmailIntelReport> {
  const d = domain.toLowerCase().replace(/\.$/, '');
  const spf = await txt(d);
  const dmarc = await txt(`_dmarc.${d}`);
  const dkimSelectors: EmailIntelReport['dkimSelectors'] = [];

  for (const sel of COMMON_DKIM) {
    const recs = await txt(`${sel}._domainkey.${d}`);
    if (recs.length) dkimSelectors.push({ selector: sel, record: recs.join(' ') });
  }

  const findings = [...analyzeSpf(spf), ...analyzeDmarc(dmarc)];
  if (dkimSelectors.length === 0) {
    findings.push({
      severity: 'low',
      id: 'no-dkim-common',
      message: 'No DKIM on common selectors (may exist on custom)',
    });
  }

  return { domain: d, spf, dmarc, dkimSelectors, findings };
}
