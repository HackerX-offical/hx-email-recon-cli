import { hasHighSeverity } from './summarize-findings.js';

describe('hasHighSeverity', () => {
  it('detects high', () => {
    expect(hasHighSeverity([{ severity: 'high', id: 'x', message: 'm' }])).toBe(true);
  });
});
