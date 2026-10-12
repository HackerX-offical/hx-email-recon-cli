import { analyzeDmarc, analyzeSpf } from '../src/email.js';

describe('email analysis', () => {
  it('flags spf +all', () => {
    expect(analyzeSpf(['v=spf1 +all'])[0].id).toBe('spf-pass-all');
  });
  it('flags missing dmarc', () => {
    expect(analyzeDmarc([])[0].id).toBe('no-dmarc');
  });
});
