# hx-email-recon-cli

**Email security DNS intelligence** — SPF, DMARC, DKIM selectors, and BIMI signals for
authorized domain assessments.

## Why this exists

Phishing and subdomain takeover prep starts with how a domain accepts and authenticates
mail. This CLI queries public DNS (TXT) and applies policy heuristics so you get
actionable findings without MXToolbox tabs during an engagement.

## Features

- Single `recon` command per domain
- SPF and DMARC TXT retrieval with parser-backed findings
- Common DKIM selector probes (`google`, `selector1`, etc.)
- JSON or terminal output; exit `2` on high-severity findings

## Install

```bash
git clone https://github.com/HackerX-official/hx-email-recon-cli.git
cd hx-email-recon-cli
npm install
npm run build
npm link   # optional: global hx-email
```

## Quick start

```bash
hx-email recon example.com
hx-email recon client.org --json
```

Pair with [hx-dns-recon-cli](https://github.com/HackerX-official/hx-dns-recon-cli) for
broader DNS surface mapping.

## Output

| Mode     | Description                                                          |
| -------- | -------------------------------------------------------------------- |
| Default  | Domain header, SPF/DMARC lines, DKIM selector snippets, finding list |
| `--json` | Structured `EmailReconReport` with `findings[]`                      |
| Exit `2` | High-severity policy gap (e.g. missing DMARC, permissive SPF)        |

## Develop

```bash
npm run format
npm run build
npm test
npm run test:integration   # live DNS against documented domains
npm run format:check
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for module layout and extension points.

## Ethics

Use only on systems and content you are **authorized** to test. See
[SECURITY.md](./SECURITY.md).

## License

Licensed under the [HackerX License](./LICENSE). Redistributions must retain copyright,
license text, and [NOTICE](./NOTICE) attribution per the license terms.
