import { analyzeSpf } from './analyze-spf.js';

describe('analyzeSpf', () => {
  it('flags +all', () => {
    expect(analyzeSpf(['v=spf1 +all'])[0].id).toBe('spf-pass-all');
  });
});
