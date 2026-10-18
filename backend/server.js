const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
app.use('/api/auth', authRoutes);

const MUTUAL_FUNDS_DB = [
  {
    id: 'MF001',
    name: 'Mirae Asset Large Cap Fund',
    category: 'Large Cap',
    riskLevel: 'Moderate',
    nav: 98.45,
    aum: 32450, 
    expenseRatio: 0.54,
    returns: { '1y': 18.2, '3y': 22.5, '5y': 19.8 },
    sharpeRatio: 1.42,
    beta: 0.89,
    alpha: 2.3,
    stdDeviation: 12.4,
    holdings: [
      { name: 'Reliance Industries', weight: 9.8, sector: 'Energy' },
      { name: 'HDFC Bank', weight: 8.2, sector: 'Finance' },
      { name: 'Infosys', weight: 7.1, sector: 'IT' },
      { name: 'TCS', weight: 6.5, sector: 'IT' },
      { name: 'ICICI Bank', weight: 5.9, sector: 'Finance' },
    ],
    sectorAllocation: { IT: 28, Finance: 25, Energy: 15, Healthcare: 12, FMCG: 10, Others: 10 },
    minSIP: 1000,
    tags: ['stable', 'blue-chip', 'low-volatility'],
  },
  {
    id: 'MF002',
    name: 'Axis Bluechip Fund',
    category: 'Large Cap',
    riskLevel: 'Moderate',
    nav: 54.12,
    aum: 28900,
    expenseRatio: 0.48,
    returns: { '1y': 16.8, '3y': 20.1, '5y': 18.3 },
    sharpeRatio: 1.38,
    beta: 0.82,
    alpha: 2.1,
    stdDeviation: 11.8,
    holdings: [
      { name: 'Bajaj Finance', weight: 9.1, sector: 'Finance' },
      { name: 'Avenue Supermarts', weight: 7.8, sector: 'Retail' },
      { name: 'Asian Paints', weight: 7.2, sector: 'FMCG' },
      { name: 'Kotak Mahindra Bank', weight: 6.8, sector: 'Finance' },
      { name: 'Maruti Suzuki', weight: 6.1, sector: 'Auto' },
    ],
    sectorAllocation: { Finance: 30, FMCG: 20, Auto: 15, IT: 18, Retail: 10, Others: 7 },
    minSIP: 500,
    tags: ['consistent', 'quality', 'growth'],
  },
  {
    id: 'MF003',
    name: 'SBI Small Cap Fund',
    category: 'Small Cap',
    riskLevel: 'High',
    nav: 142.30,
    aum: 18200,
    expenseRatio: 0.76,
    returns: { '1y': 35.4, '3y': 38.2, '5y': 32.1 },
    sharpeRatio: 1.65,
    beta: 1.28,
    alpha: 8.5,
    stdDeviation: 22.1,
    holdings: [
      { name: 'Craftsman Automation', weight: 4.2, sector: 'Engineering' },
      { name: 'Elgi Equipments', weight: 3.8, sector: 'Engineering' },
      { name: 'Birlasoft', weight: 3.5, sector: 'IT' },
      { name: 'Sudarshan Chemical', weight: 3.1, sector: 'Chemicals' },
      { name: 'Shyam Metalics', weight: 2.9, sector: 'Metals' },
    ],
    sectorAllocation: { Engineering: 22, IT: 18, Chemicals: 15, Metals: 12, Healthcare: 10, Others: 23 },
    minSIP: 500,
    tags: ['high-growth', 'aggressive', 'wealth-creation'],
  },
  {
    id: 'MF004',
    name: 'HDFC Balanced Advantage Fund',
    category: 'Hybrid',
    riskLevel: 'Moderate',
    nav: 385.20,
    aum: 68400,
    expenseRatio: 0.82,
    returns: { '1y': 14.2, '3y': 17.8, '5y': 16.5 },
    sharpeRatio: 1.21,
    beta: 0.74,
    alpha: 1.8,
    stdDeviation: 10.2,
    holdings: [
      { name: 'HDFC Bank', weight: 7.5, sector: 'Finance' },
      { name: 'Reliance Industries', weight: 6.9, sector: 'Energy' },
      { name: 'Infosys', weight: 6.1, sector: 'IT' },
      { name: 'Govt Bonds 2028', weight: 5.8, sector: 'Debt' },
      { name: 'TCS', weight: 5.2, sector: 'IT' },
    ],
    sectorAllocation: { Equity: 65, Debt: 30, Cash: 5 },
    minSIP: 100,
    tags: ['balanced', 'defensive', 'consistent-income'],
  },
  {
    id: 'MF005',
    name: 'Parag Parikh Flexi Cap Fund',
    category: 'Flexi Cap',
    riskLevel: 'Moderate-High',
    nav: 68.95,
    aum: 52100,
    expenseRatio: 0.61,
    returns: { '1y': 28.9, '3y': 30.4, '5y': 26.8 },
    sharpeRatio: 1.58,
    beta: 0.91,
    alpha: 6.2,
    stdDeviation: 14.8,
    holdings: [
      { name: 'Alphabet (Google)', weight: 8.2, sector: 'Global Tech' },
      { name: 'Meta Platforms', weight: 5.9, sector: 'Global Tech' },
      { name: 'HDFC Bank', weight: 7.1, sector: 'Finance' },
      { name: 'ITC', weight: 6.8, sector: 'FMCG' },
      { name: 'Power Grid', weight: 5.5, sector: 'Utilities' },
    ],
    sectorAllocation: { 'Global Tech': 22, Finance: 20, FMCG: 18, IT: 15, Utilities: 12, Others: 13 },
    minSIP: 1000,
    tags: ['global-exposure', 'diversified', 'value-investing'],
  },
  {
    id: 'MF006',
    name: 'Kotak Emerging Equity Fund',
    category: 'Mid Cap',
    riskLevel: 'High',
    nav: 112.85,
    aum: 22600,
    expenseRatio: 0.44,
    returns: { '1y': 31.2, '3y': 34.6, '5y': 28.9 },
    sharpeRatio: 1.52,
    beta: 1.15,
    alpha: 7.1,
    stdDeviation: 18.6,
    holdings: [
      { name: 'Persistent Systems', weight: 5.8, sector: 'IT' },
      { name: 'Coforge', weight: 5.1, sector: 'IT' },
      { name: 'Cholamandalam Investment', weight: 4.9, sector: 'Finance' },
      { name: 'Astral', weight: 4.2, sector: 'Building Materials' },
      { name: 'Deepak Nitrite', weight: 3.8, sector: 'Chemicals' },
    ],
    sectorAllocation: { IT: 26, Finance: 22, Chemicals: 16, Consumer: 14, Healthcare: 12, Others: 10 },
    minSIP: 1000,
    tags: ['mid-cap-leader', 'emerging-sectors', 'strong-alpha'],
  },
];

function scoreFund(fund, profile) {
  let score = 0;
  const reasons = [];

  const riskMap = { Conservative: 1, Moderate: 2, 'Moderate-High': 3, Aggressive: 4 };
  const fundRiskScore = riskMap[fund.riskLevel] || 2;
  const userRiskScore = riskMap[profile.riskTolerance] || 2;
  const riskDiff = Math.abs(fundRiskScore - userRiskScore);
  const riskPoints = Math.max(0, 30 - riskDiff * 10);
  score += riskPoints;
  if (riskDiff === 0) reasons.push('Perfect risk-level match for your profile');
  else if (riskDiff === 1) reasons.push('Near-optimal risk alignment');

  const horizon = parseInt(profile.investmentHorizon);
  if (horizon >= 7 && fund.category !== 'Hybrid') { score += 20; reasons.push('Ideal for your long investment horizon'); }
  else if (horizon >= 3 && horizon < 7) { score += 15; if (fund.category === 'Hybrid') reasons.push('Hybrid exposure suits your medium-term horizon'); }
  else if (horizon < 3) { score += fund.riskLevel === 'Low' || fund.category === 'Hybrid' ? 20 : 5; }

  const returnScore = Math.min(25, (fund.returns['3y'] / 40) * 25);
  score += returnScore;
  reasons.push(`Strong 3-year CAGR of ${fund.returns['3y']}%`);

  const sharpeScore = Math.min(15, fund.sharpeRatio * 8);
  score += sharpeScore;
  if (fund.sharpeRatio > 1.4) reasons.push(`Excellent Sharpe ratio (${fund.sharpeRatio}) — great risk-adjusted returns`);

  const expenseScore = Math.max(0, 10 - fund.expenseRatio * 5);
  score += expenseScore;
  if (fund.expenseRatio < 0.6) reasons.push(`Low expense ratio of ${fund.expenseRatio}% maximizes your returns`);

  if (profile.investmentGoal === 'Wealth Creation' && fund.returns['5y'] > 20) {
    score += 5; reasons.push('Proven wealth creation track record over 5 years');
  }
  if (profile.investmentGoal === 'Retirement Planning' && fund.beta < 1) {
    score += 5; reasons.push('Lower beta means stable growth ideal for retirement');
  }
  if (profile.investmentGoal === 'Tax Saving' && fund.category === 'ELSS') {
    score += 10; reasons.push('ELSS qualifies for Section 80C tax deduction');
  }

  if (profile.monthlySIP >= fund.minSIP) {
    score += 3;
  }

  return { score: Math.round(score), reasons: reasons.slice(0, 3) };
}

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.post('/api/analyze', (req, res) => {
  const profile = req.body;

  const required = ['age', 'monthlyIncome', 'monthlySIP', 'riskTolerance', 'investmentGoal', 'investmentHorizon'];
  for (const field of required) {
    if (!profile[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  const scored = MUTUAL_FUNDS_DB.map(fund => {
    const { score, reasons } = scoreFund(fund, profile);
    return { ...fund, matchScore: score, matchReasons: reasons };
  });

  const topFunds = scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

  const sip = parseFloat(profile.monthlySIP);
  const horizon = parseInt(profile.investmentHorizon);
  const avgReturn = topFunds.reduce((sum, f) => sum + f.returns['5y'], 0) / topFunds.length / 100;
  const monthlyRate = avgReturn / 12;
  const months = horizon * 12;
  const projectedValue = Math.round(sip * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  const totalInvested = sip * months;

  res.json({
    profile,
    topFunds,
    portfolio: {
      totalInvested,
      projectedValue,
      expectedGrowth: Math.round(((projectedValue - totalInvested) / totalInvested) * 100),
      avgExpectedReturn: (avgReturn * 100).toFixed(1),
      allFunds: scored.map(f => ({ id: f.id, name: f.name, score: f.matchScore, category: f.category })),
    },
    suggestions: generateSuggestions(profile, topFunds),
    timestamp: new Date(),
  });
});

app.get('/api/fund/:id', (req, res) => {
  const fund = MUTUAL_FUNDS_DB.find(f => f.id === req.params.id);
  if (!fund) return res.status(404).json({ error: 'Fund not found' });
  res.json(fund);
});

app.get('/api/funds', (req, res) => {
  let funds = [...MUTUAL_FUNDS_DB];
  if (req.query.category) funds = funds.filter(f => f.category === req.query.category);
  if (req.query.risk) funds = funds.filter(f => f.riskLevel === req.query.risk);
  res.json(funds);
});

app.get('/api/fund/:id/nav-history', (req, res) => {
  const fund = MUTUAL_FUNDS_DB.find(f => f.id === req.params.id);
  if (!fund) return res.status(404).json({ error: 'Fund not found' });

  const history = [];
  let nav = fund.nav * 0.6;
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    nav = nav * (1 + (Math.random() - 0.45) * 0.02);
    history.push({ date: date.toISOString().split('T')[0], nav: Math.round(nav * 100) / 100 });
  }
  res.json(history);
});

const frontendBuildPath = path.join(__dirname, '../frontend/build');
if (require('fs').existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

function generateSuggestions(profile, topFunds) {
  const suggestions = [];
  const age = parseInt(profile.age);
  const horizon = parseInt(profile.investmentHorizon);
  const sip = parseFloat(profile.monthlySIP);
  const income = parseFloat(profile.monthlyIncome);
  const sipRatio = (sip / income) * 100;

  if (sipRatio < 10) suggestions.push({ type: 'increase-sip', icon: '📈', title: 'Increase your SIP', message: `You're investing ${sipRatio.toFixed(0)}% of income. Financial advisors recommend 20-30%. Even ₹${Math.round(income * 0.2 - sip).toLocaleString('en-IN')}/month more can significantly boost wealth.` });
  if (age < 35 && profile.riskTolerance === 'Conservative') suggestions.push({ type: 'risk-advice', icon: '⚡', title: 'Consider Higher Risk', message: 'At your age, a moderate-aggressive strategy can significantly amplify long-term wealth. Time heals market volatility.' });
  if (horizon > 10) suggestions.push({ type: 'compounding', icon: '🚀', title: 'Power of Compounding', message: `With ${horizon} years, compounding works heavily in your favor. Starting today vs 1 year later can cost you ₹${Math.round(sip * 12 * 0.18 * horizon).toLocaleString('en-IN')} in potential growth.` });
  if (topFunds.some(f => f.category === 'Small Cap') && age > 50) suggestions.push({ type: 'caution', icon: '⚠️', title: 'Rebalance Consideration', message: 'As you approach 50+, gradually shift small-cap exposure to large-cap or hybrid funds to protect your corpus.' });

  suggestions.push({ type: 'diversification', icon: '🎯', title: 'Diversify Across Categories', message: `Spread your SIP across your top ${topFunds.length} recommended funds to balance risk and maximize sector exposure.` });

  return suggestions;
}

app.listen(PORT, () => console.log(`🚀 MAXRET FUNDS API running on port ${PORT}`));
