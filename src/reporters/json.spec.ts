import { reportToJson } from './json.js';

describe('reportToJson', () => {
  it('parses', () => {
    expect(JSON.parse(reportToJson({ domain: 'x', dkimSelectors: [], findings: [] })).domain).toBe('x');
  });
});
