#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { reconEmailDomain } from './email.js';
import { hasHighSeverity } from './analysis/summarize-findings.js';
import { reportToJson } from './reporters/json.js';
import { formatFindingLine } from './reporters/table.js';

const program = new Command();
program.name('hx-email').description('Email security DNS intelligence').version('1.0.0');

program
  .command('recon')
  .argument('<domain>')
  .option('--json', 'JSON report')
  .action(async (domain: string, opts: { json?: boolean }) => {
    const r = await reconEmailDomain(domain);
    if (opts.json) console.log(reportToJson(r));
    else {
      console.log(chalk.bold(r.domain));
      console.log('SPF:', r.spf?.join(' | ') || '(none)');
      console.log('DMARC:', r.dmarc?.join(' | ') || '(none)');
      r.dkimSelectors.forEach((d) => console.log(`DKIM ${d.selector}:`, d.record?.slice(0, 80)));
      r.findings.forEach((f) => console.log(formatFindingLine(f)));
    }
    process.exit(hasHighSeverity(r.findings) ? 2 : 0);
  });

program.parse();
