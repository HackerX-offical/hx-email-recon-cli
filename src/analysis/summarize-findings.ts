import type { EmailFinding } from '../types.js';

export function hasHighSeverity(findings: EmailFinding[]): boolean {
  return findings.some((f) => f.severity === 'critical' || f.severity === 'high');
}
