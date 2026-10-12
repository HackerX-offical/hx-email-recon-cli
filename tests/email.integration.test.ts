import { reconEmailDomain } from '../src/email.js';

describe('reconEmailDomain live', () => {
  it('resolves google.com email dns', async () => {
    const r = await reconEmailDomain('google.com');
    expect(r.spf.length + r.dmarc.length).toBeGreaterThan(0);
  });
});
