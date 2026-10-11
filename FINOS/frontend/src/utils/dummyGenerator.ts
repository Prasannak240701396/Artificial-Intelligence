import { ProjectDispatch, EmailLog, Transaction } from '../types';

// Helper to pick random item from array
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const LOCATIONS = [
  'Sector 18 Tech Hub & Outer Ring Corridor',
  'North Industrial Zone, Grid Sector 4',
  'Riverside Basin & Central District',
  'Metro Extension Line 3, East Wing',
  'Western Highway Bypass Sector 9',
  'Southern Coastal Waterway Pipeline',
  'Central Smart Grid Power Substation',
  'Port Harbor Logistics & Freight Terminal',
  'Airport Expressway Elevated Bridge',
  'Greenfield Solar Energy Park, Sector 22',
  'High-Speed Rail Overpass Sector 14',
  'District Hospital Infrastructure Expansion',
  'Urban Drainage & Flood Bypass Complex',
  'Clean Water Treatment Aqueduct Phase 2',
  'Industrial Corridor Freight Flyover'
];

const POSITIONS = [
  { name: 'Chief Executive Officer (CEO)', role: 'CEO', batch: 'EXEC-HQ-9041' },
  { name: 'Regional Director', role: 'DIRECTOR', batch: 'DIR-HQ-7732' },
  { name: 'Project Manager', role: 'PROJECT_MANAGER', batch: 'MGR-OPS-6611' },
  { name: 'Operations Manager', role: 'OPERATIONS_MANAGER', batch: 'MGR-OPS-8822' },
  { name: 'HR Manager', role: 'HR_MANAGER', batch: 'MGR-HR-4433' },
  { name: 'Site Incharge', role: 'SITE_INCHARGE', batch: 'FLD-SITE-5544' }
];

const PROJECT_TYPES = [
  'Elevated Highway Flyover & Metro Support Pillars',
  '100MW Smart Solar Substation & Battery Bank',
  'Automated Water Filtration Plant & Aqueduct',
  'Underground Fiber Optic Grid & Cyber Ducting',
  'Heavy Freight Railway Overbridge & Yard',
  'District Central Hospital Emergency Wing Expansion',
  'Coastal Sea-Wall Protection & Dredging Basin',
  'Municipal Solid Waste Waste-to-Energy Plant',
  'Multi-Level Logistics Hub & EV Charging Terminal',
  'Smart City Traffic Automation & Radar Array'
];

// Generate 100+ Project Dispatches
export const generate100Projects = (): ProjectDispatch[] => {
  const projects: ProjectDispatch[] = [];
  const tiers = ['CEO', 'DIRECTOR', 'PROJECT_MANAGER', 'OPERATIONS_MANAGER', 'HR_MANAGER', 'SITE_INCHARGE', 'COMPLETED'];
  
  for (let i = 1; i <= 110; i++) {
    const codeNum = String(i).padStart(3, '0');
    const pType = pick(PROJECT_TYPES);
    const loc = pick(LOCATIONS);
    const amt = parseFloat((Math.random() * 85 + 5).toFixed(2));
    const creator = pick(POSITIONS);
    const tier = pick(tiers);
    
    let status = `FORWARDED_TO_${tier}`;
    if (tier === 'CEO') status = 'APPROVED_BY_CEO';
    if (tier === 'COMPLETED') status = 'FULLY_EXECUTED';

    projects.push({
      id: i,
      project_code: `PRJ-INF-2026-${codeNum}`,
      title: `${pType} - Package #${codeNum}`,
      location: loc,
      estimated_amount: amt,
      description: `Official Capital Dispatch Instruction: Authorization of ${pType.toLowerCase()} located at ${loc}. Total allocated budget is ₹${amt.toFixed(
        2
      )} Cr. Strict compliance with environmental and structural guidelines required before disbursement.`,
      current_tier: tier,
      status: status,
      created_by_name: creator.name,
      created_by_email: `${creator.role.toLowerCase()}@finos.gov.in`,
      created_by_batch: creator.batch,
      timestamp: new Date(Date.now() - 3600000 * (i * 2)).toISOString()
    });
  }

  return projects;
};

// Generate 100+ Email Dispatch Logs
export const generate100Emails = (): EmailLog[] => {
  const emails: EmailLog[] = [];
  const statuses: ('SENT' | 'DELIVERED' | 'ACKNOWLEDGED')[] = ['SENT', 'DELIVERED', 'ACKNOWLEDGED'];

  for (let i = 1; i <= 105; i++) {
    const codeNum = String(i).padStart(3, '0');
    const sender = pick(POSITIONS);
    const recipient = pick(POSITIONS.filter((p) => p.role !== sender.role));
    const amt = parseFloat((Math.random() * 60 + 10).toFixed(2));
    const projectTitle = pick(PROJECT_TYPES);

    emails.push({
      id: 100 + i,
      project_id: i,
      sender_name: sender.name,
      sender_email: `${sender.role.toLowerCase()}@finos.gov.in`,
      sender_role: sender.name,
      sender_batch: sender.batch,
      recipient_name: recipient.name,
      recipient_email: `${recipient.role.toLowerCase()}@finos.gov.in`,
      recipient_role: recipient.name,
      subject: `[FINOS DISPATCH #PRJ-INF-2026-${codeNum}] Capital Authorization - ${projectTitle}`,
      body_text: `OFFICIAL DISPATCH NOTICE:\n\nAttention: ${recipient.name},\n\nWe are authorizing dispatch for construction project '${projectTitle}' (Package #${codeNum}). Estimated capital allocated is ₹${amt.toFixed(
        2
      )} Cr.\n\nPlease inspect technical specifications, review phase expenditure thresholds, and acknowledge dispatch to the next officer level.\n\nSender: ${sender.name} (${sender.batch})`,
      estimated_amount: amt,
      dispatch_status: pick(statuses),
      timestamp: new Date(Date.now() - 3600000 * (i * 1.5)).toISOString()
    });
  }

  return emails;
};

// Generate 60+ Downloadable Report Packages
export interface DownloadableReport {
  id: string;
  title: string;
  category: 'FINANCIAL' | 'RISK' | 'AUDIT' | 'BUDGET';
  period: string;
  generatedDate: string;
  status: 'VERIFIED' | 'DRAFT' | 'PENDING';
  fileSize: string;
  summary: string;
  projectCode: string;
  itemCount: number;
}

export const generate60Reports = (): DownloadableReport[] => {
  const reports: DownloadableReport[] = [];
  const categories: ('FINANCIAL' | 'RISK' | 'AUDIT' | 'BUDGET')[] = ['FINANCIAL', 'RISK', 'AUDIT', 'BUDGET'];
  
  for (let i = 1; i <= 65; i++) {
    const num = String(i).padStart(3, '0');
    const cat = pick(categories);
    const projectTitle = pick(PROJECT_TYPES);
    const projectCode = `PRJ-INF-2026-${num}`;

    reports.push({
      id: `REP-2026-${num}`,
      projectCode: projectCode,
      title: `Project #${num}: ${projectTitle} Audit & Dispatch Statement`,
      category: cat,
      period: `Q${(i % 4) + 1} FY 2026`,
      generatedDate: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
      status: i % 10 === 0 ? 'DRAFT' : 'VERIFIED',
      fileSize: `${(Math.random() * 4 + 1.2).toFixed(1)} MB`,
      summary: `Comprehensive 500+ line item cryptographic ledger and voucher breakdown for ${projectTitle} (${projectCode}). Includes itemized disbursements, contractor line items, risk scores, and site inspection compliance stamps.`,
      itemCount: 500 + (i % 50) * 5 // 500+ rows
    });
  }

  return reports;
};

// Generate 500+ detailed CSV rows for a report download
export const generate500CSVRows = (report: DownloadableReport): string => {
  const headers = [
    'Row ID',
    'Voucher Code',
    'Project Code',
    'Project Name',
    'Site Location',
    'Line Item Category',
    'Contractor Name / Supplier',
    'Approved Budget (INR Cr)',
    'Disbursed Amount (INR Cr)',
    'Variance Balance (INR Cr)',
    'Approval Officer Position',
    'Officer Batch ID',
    'Dispatch Status',
    'Verification Hash (SHA-256)',
    'Risk Exposure Score (0-100)',
    'Inspection Date',
    'GPS Coordinates',
    'Compliance Audit Notes'
  ].join(',');

  const contractors = [
    'Larsen Infrastructure Construction Corp',
    'Tata Heavy Engineering & Power Ltd',
    'Reliance Metro Utilities Solutions',
    'Godrej Urban Civil Works & Aqueducts',
    'L&T Smart Grid Energy Systems',
    'Hindustan Infra Projects Ltd',
    'Adani Industrial Logistics Infra'
  ];

  const categories = [
    'Structural Concrete & Rebar Reinforcement',
    'High-Voltage Underground Cable Trenching',
    'Hydraulic Valve & Filtration Pump Assembly',
    'Geotechnical Soil Testing & Foundation Piling',
    'HVAC & Environmental Monitoring Sensor Array',
    'Heavy Excavation & Drainage Bypass Earthworks',
    'Architectural Structural Steel Fabrication',
    'Automated Scada Control Panel & Telemetry'
  ];

  const positions = [
    'Chief Executive Officer (CEO)',
    'Regional Director',
    'Project Operations Manager',
    'Operations Manager',
    'HR Manager',
    'Site Incharge / Field Engineer'
  ];

  const rows: string[] = [headers];
  const rowCount = report.itemCount || 520;

  for (let r = 1; r <= rowCount; r++) {
    const vCode = `VCH-2026-${String(r).padStart(5, '0')}`;
    const contractor = contractors[r % contractors.length];
    const category = categories[r % categories.length];
    const position = positions[r % positions.length];
    const budget = (Math.random() * 0.8 + 0.1).toFixed(4);
    const disbursed = (parseFloat(budget) * (0.85 + Math.random() * 0.15)).toFixed(4);
    const variance = (parseFloat(budget) - parseFloat(disbursed)).toFixed(4);
    const risk = Math.floor(Math.random() * 25 + 5);
    const hash = `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const lat = (18.9 + Math.random() * 0.5).toFixed(6);
    const lng = (72.8 + Math.random() * 0.5).toFixed(6);

    const row = [
      r,
      `"${vCode}"`,
      `"${report.projectCode}"`,
      `"${report.title.replace(/"/g, '""')}"`,
      `"${pick(LOCATIONS)}"`,
      `"${category}"`,
      `"${contractor}"`,
      budget,
      disbursed,
      variance,
      `"${position}"`,
      `"EMP-2026-${1000 + (r % 900)}"`,
      '"VERIFIED_DISPATCH"',
      `"${hash}"`,
      risk,
      `"2026-0${(r % 9) + 1}-${String((r % 28) + 1).padStart(2, '0')}"`,
      `"${lat} N, ${lng} E"`,
      `"Audited & Verified under FINOS Governance Standard Phase ${ (r % 4) + 1 }"`
    ].join(',');

    rows.push(row);
  }

  return rows.join('\n');
};

// Generate 75+ Market Assets
export interface MarketAssetItem {
  symbol: string;
  name: string;
  category: 'INDEX' | 'COMMODITY' | 'FOREX' | 'BOND' | 'EQUITY';
  price: number;
  changeAmount: number;
  changePct: number;
  high: number;
  low: number;
  volume: string;
}

export const generate75MarketAssets = (): MarketAssetItem[] => {
  const assets: MarketAssetItem[] = [];
  const assetTypes: ('INDEX' | 'COMMODITY' | 'FOREX' | 'BOND' | 'EQUITY')[] = ['INDEX', 'COMMODITY', 'FOREX', 'BOND', 'EQUITY'];

  const sampleNames = [
    { s: 'NIFTY 50', n: 'NIFTY 50 Benchmark Index', c: 'INDEX', p: 24580.45 },
    { s: 'S&P 500', n: 'S&P 500 US Index', c: 'INDEX', p: 5620.10 },
    { s: 'BANK NIFTY', n: 'NIFTY Bank Sector Index', c: 'INDEX', p: 52340.80 },
    { s: 'NASDAQ', n: 'NASDAQ Composite Tech Index', c: 'INDEX', p: 17890.25 },
    { s: 'GOLD 1KG', n: 'Gold Spot Bullion 24K', c: 'COMMODITY', p: 72450.00 },
    { s: 'BRENT CRUDE', n: 'Brent Crude Oil Barrel', c: 'COMMODITY', p: 78.40 },
    { s: 'USD/INR', n: 'US Dollar vs Indian Rupee', c: 'FOREX', p: 83.92 },
    { s: 'EUR/INR', n: 'Euro vs Indian Rupee', c: 'FOREX', p: 91.45 },
    { s: 'MUNI-GREEN-2026', n: 'State Municipal Green Infrastructure Bond 7.4%', c: 'BOND', p: 102.40 },
    { s: 'POWER-GRID-BOND', n: 'National Power Grid Infrastructure Bond 8.1%', c: 'BOND', p: 105.10 },
    { s: 'L&T INFRA', n: 'Larsen & Toubro Civil Infra Equity', c: 'EQUITY', p: 3540.60 },
    { s: 'TATA POWER', n: 'Tata Power Renewable Energy Equity', c: 'EQUITY', p: 440.25 },
  ];

  for (let i = 1; i <= 80; i++) {
    const base = sampleNames[i % sampleNames.length];
    const cat = pick(assetTypes);
    const variation = (Math.random() - 0.48) * (base.p * 0.03);
    const curPrice = parseFloat((base.p + variation).toFixed(2));
    const chgPct = parseFloat(((Math.random() - 0.47) * 2.5).toFixed(2));
    const chgAmt = parseFloat(((curPrice * chgPct) / 100).toFixed(2));

    assets.push({
      symbol: i <= sampleNames.length ? base.s : `${cat}-ASSET-${String(i).padStart(3, '0')}`,
      name: i <= sampleNames.length ? base.n : `Municipal ${cat} Series Package #${i}`,
      category: cat,
      price: curPrice,
      changeAmount: chgAmt,
      changePct: chgPct,
      high: parseFloat((curPrice * 1.015).toFixed(2)),
      low: parseFloat((curPrice * 0.985).toFixed(2)),
      volume: `${(Math.random() * 50 + 5).toFixed(1)}K`
    });
  }

  return assets;
};

// Generate 75+ Department Budgets
export interface DeptBudgetItem {
  department_id: string;
  department_code: string;
  department_name: string;
  allocated_budget: number;
  spent_budget: number;
  remaining_budget: number;
  utilization_pct: number;
  manager: string;
  category: string;
  lastActivity: string;
}

export const generate75Budgets = (): DeptBudgetItem[] => {
  const depts: DeptBudgetItem[] = [];
  const deptNames = [
    'Public Works & Highway Bridges',
    'Healthcare & District Hospitals',
    'Education & Youth Laboratories',
    'Public Transport & EV Bus Fleet',
    'Energy & Solar Micro-Grids',
    'IT & Digital Governance Cyber Core',
    'Municipal Water Supply & Aqueducts',
    'Sanitation & Solid Waste Management',
    'Urban Renewal & Smart Lighting',
    'Fire Safety & Emergency Response',
    'Environmental Protection & Dredging',
    'Industrial Corridor Logistics Facilities',
    'Disaster Management & Flood Bypass',
    'Telecommunication & Underground Fiber',
    'Coastal Marine Protection Barrier'
  ];

  const positions = [
    'Chief Executive Officer (CEO)',
    'Regional Director',
    'Project Operations Manager',
    'Operations Manager',
    'HR Manager',
    'Site Incharge / Field Engineer'
  ];

  for (let i = 1; i <= 80; i++) {
    const num = String(i).padStart(3, '0');
    const dName = deptNames[i % deptNames.length];
    const allocated = Math.floor(Math.random() * 40000000 + 10000000); // ₹1Cr to ₹5Cr
    const pct = parseFloat((Math.random() * 35 + 60).toFixed(1)); // 60% to 95%
    const spent = Math.floor((allocated * pct) / 100);
    const remaining = allocated - spent;
    const pos = positions[i % positions.length];

    depts.push({
      department_id: String(i),
      department_code: `DEPT-${num}`,
      department_name: `${dName} (Division #${num})`,
      allocated_budget: allocated,
      spent_budget: spent,
      remaining_budget: remaining,
      utilization_pct: pct,
      manager: `${pos} • Batch #${1000 + i}`,
      category: pick(['Infrastructure', 'Equipment', 'Renewables', 'Maintenance', 'Cyber', 'Scholarships']),
      lastActivity: `₹${(Math.random() * 15 + 2).toFixed(1)}L vendor disbursement approved`
    });
  }

  return depts;
};

// Generate 1000+ Transactions CSV data
export const generate1000TransactionsCSV = (): string => {
  const headers = [
    'Transaction Code',
    'Account ID',
    'Department Name',
    'Category',
    'Amount (INR Cr)',
    'Transaction Type',
    'Risk Score (0-100)',
    'Status',
    'Counterparty Vendor',
    'Timestamp',
    'Verification Hash (SHA-256)',
    'Authorizing Officer Position'
  ].join(',');

  const vendors = [
    'Larsen Heavy Infrastructure Ltd',
    'Tata Solar Substation Grid Ltd',
    'Reliance Aqueduct Pipeline Corp',
    'Godrej Electrical Control Systems',
    'Adani Freight Logistics Corp',
    'Siemens Scada Systems India',
    'Bosch Environmental Monitoring Ltd'
  ];

  const categories = [
    'Capital Infrastructure',
    'Operational Expenditure',
    'Medical Supplies Procurement',
    'Fleet EV Bus Charging Maintenance',
    'Cyber Security Server Bandwidth',
    'Water Treatment Chemical Supply'
  ];

  const positions = [
    'Chief Executive Officer (CEO)',
    'Regional Director',
    'Project Operations Manager',
    'Operations Manager',
    'HR Manager',
    'Site Incharge / Field Engineer'
  ];

  const rows: string[] = [headers];

  for (let i = 1; i <= 1050; i++) {
    const code = `TXN-2026-${String(i).padStart(5, '0')}`;
    const accId = `ACC-100${(i % 15) + 1}`;
    const vendor = vendors[i % vendors.length];
    const cat = categories[i % categories.length];
    const pos = positions[i % positions.length];
    const amt = (Math.random() * 1.5 + 0.05).toFixed(4);
    const type = i % 7 === 0 ? 'CREDIT' : 'DEBIT';
    const risk = Math.floor(Math.random() * 35 + 2);
    const status = risk > 25 ? 'Under Review' : 'Completed';
    const hash = `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    rows.push([
      `"${code}"`,
      `"${accId}"`,
      `"Municipal Division #${(i % 15) + 1}"`,
      `"${cat}"`,
      amt,
      `"${type}"`,
      risk,
      `"${status}"`,
      `"${vendor}"`,
      `"2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 14:20:00"`,
      `"${hash}"`,
      `"${pos}"`
    ].join(','));
  }

  return rows.join('\n');
};

// Generate 75+ Live Transactions for UI table
export const generate75Transactions = (): Transaction[] => {
  const txns: Transaction[] = [];
  const vendors = [
    'Larsen Heavy Infrastructure Ltd',
    'Tata Solar Substation Grid Ltd',
    'Reliance Aqueduct Pipeline Corp',
    'Godrej Electrical Control Systems',
    'Adani Freight Logistics Corp',
    'Siemens Scada Systems India',
    'Bosch Environmental Monitoring Ltd'
  ];

  for (let i = 1; i <= 85; i++) {
    const codeNum = String(i).padStart(4, '0');
    const amt = parseFloat((Math.random() * 4500000 + 500000).toFixed(2));
    const risk = Math.floor(Math.random() * 45 + 5);
    const status = risk > 35 ? 'Flagged' : risk > 20 ? 'Pending' : 'Completed';

    txns.push({
      id: i,
      transaction_code: `TXN-2026-${codeNum}`,
      account_id: (i % 12) + 1,
      department_id: (i % 8) + 1,
      department_name: `Public Division Sector #${(i % 12) + 1}`,
      category: pick(['Capital Infra', 'Utilities', 'Maintenance', 'Equipment', 'Payroll']),
      amount: amt,
      currency: '₹',
      transaction_type: i % 8 === 0 ? 'CREDIT' : 'DEBIT',
      risk_score: risk,
      status: status as any,
      timestamp: new Date(Date.now() - 3600000 * i).toISOString(),
      counterparty: pick(vendors),
      description: `Official voucher payout for Division #${(i % 12) + 1}`
    });
  }

  return txns;
};

// Generate 75+ Payment Voucher Requests
export interface PaymentVoucher {
  id: number;
  voucherCode: string;
  projectCode: string;
  vendorName: string;
  department: string;
  amount: number;
  officerPosition: string;
  officerEmail: string;
  recipientFieldOfficer: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  dueDate: string;
}

export const generate75Payments = (): PaymentVoucher[] => {
  const payments: PaymentVoucher[] = [];
  const vendors = [
    'Larsen Heavy Infrastructure Ltd',
    'Tata Solar Substation Grid Ltd',
    'Reliance Aqueduct Pipeline Corp',
    'Godrej Electrical Control Systems',
    'Adani Freight Logistics Corp'
  ];

  const positions = [
    { pos: 'Site Incharge / Field Engineer', email: 'site.incharge@finos.gov.in' },
    { pos: 'Project Manager', email: 'project.manager@finos.gov.in' },
    { pos: 'Operations Manager', email: 'operations.manager@finos.gov.in' },
    { pos: 'HR Manager', email: 'hr.manager@finos.gov.in' },
    { pos: 'Regional Director', email: 'regional.director@finos.gov.in' }
  ];

  for (let i = 1; i <= 80; i++) {
    const num = String(i).padStart(3, '0');
    const officer = pick(positions);

    payments.push({
      id: i,
      voucherCode: `PAY-2026-${num}`,
      projectCode: `PRJ-INF-2026-${num}`,
      vendorName: pick(vendors),
      department: `Municipal Division #${(i % 12) + 1}`,
      amount: parseFloat((Math.random() * 25 + 2).toFixed(2)),
      officerPosition: officer.pos,
      officerEmail: officer.email,
      recipientFieldOfficer: `Field Officer (${officer.pos})`,
      status: i % 4 === 0 ? 'APPROVED' : i % 7 === 0 ? 'REJECTED' : 'PENDING_APPROVAL',
      dueDate: `2026-10-${String((i % 25) + 1).padStart(2, '0')}`
    });
  }

  return payments;
};
