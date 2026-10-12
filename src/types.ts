export interface EmailFinding {
  severity: string;
  id: string;
  message: string;
}

export interface EmailIntelReport {
  domain: string;
  spf?: string[];
  dmarc?: string[];
  dkimSelectors: Array<{ selector: string; record?: string }>;
  findings: EmailFinding[];
}

export type TxtResolver = (name: string) => Promise<string[]>;
