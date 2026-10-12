import type { EmailIntelReport, TxtResolver } from '../types.js';
import { defaultTxtResolver } from '../dns/resolve-txt.js';
import { analyzeSpf } from '../analysis/analyze-spf.js';
import { analyzeDmarc } from '../analysis/analyze-dmarc.js';
import { COMMON_DKIM_SELECTORS } from '../constants/dkim-selectors.js';

export function normalizeEmailDomain(domain: string): string {
  return domain.toLowerCase().replace(/\.$/, '');
}

export async function reconEmailDomain(
  domain: string,
  resolveTxt: TxtResolver = defaultTxtResolver,
): Promise<EmailIntelReport> {
  const d = normalizeEmailDomain(domain);
  const spf = await resolveTxt(d);
  const dmarc = await resolveTxt(`_dmarc.${d}`);
  const dkimSelectors: EmailIntelReport['dkimSelectors'] = [];

  for (const sel of COMMON_DKIM_SELECTORS) {
    const recs = await resolveTxt(`${sel}._domainkey.${d}`);
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
