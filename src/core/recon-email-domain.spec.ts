import { reconEmailDomain } from './recon-email-domain.js';

describe('reconEmailDomain', () => {
  it('uses mock resolver', async () => {
    const r = await reconEmailDomain('example.com', async (name) => {
      if (name === 'example.com') return ['v=spf1 -all'];
      if (name === '_dmarc.example.com') return ['v=DMARC1; p=reject'];
      return [];
    });
    expect(r.findings.some((f) => f.id === 'dmarc-reject')).toBe(true);
  });
});
