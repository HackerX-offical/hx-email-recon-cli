import chalk from 'chalk';
import type { EmailIntelReport } from '../types.js';

export function formatFindingLine(f: EmailIntelReport['findings'][0]): string {
  return chalk.yellow(`[${f.severity}] ${f.message}`);
}
