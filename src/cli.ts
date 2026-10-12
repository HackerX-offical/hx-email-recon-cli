#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { reconEmailDomain } from './email.js';

const program = new Command();
program.name('hx-email').description('Email security DNS intelligence').version('1.0.0');

program
  .command('recon')
  .argument('<domain>')
  .option('--json', 'JSON report')
  .action(async (domain: string, opts: { json?: boolean }) => {
    const r = await reconEmailDomain(domain);
    if (opts.json) console.log(JSON.stringify(r, null, 2));
    else {
      console.log(chalk.bold(r.domain));
      console.log('SPF:', r.spf?.join(' | ') || '(none)');
      console.log('DMARC:', r.dmarc?.join(' | ') || '(none)');
      r.dkimSelectors.forEach((d) => console.log(`DKIM ${d.selector}:`, d.record?.slice(0, 80)));
      r.findings.forEach((f) => console.log(chalk.yellow(`[${f.severity}] ${f.message}`)));
    }
    process.exit(r.findings.some((f) => f.severity === 'critical' || f.severity === 'high') ? 2 : 0);
  });

program.parse();
