import { analyzeDmarc } from './analyze-dmarc.js';

describe('analyzeDmarc', () => {
  it('flags missing', () => {
    expect(analyzeDmarc([])[0].id).toBe('no-dmarc');
  });
});
