export const formatINR = (amount) => {
  if (!amount) return '₹0';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatPercent = (val, decimals = 1) =>
  `${val > 0 ? '+' : ''}${parseFloat(val).toFixed(decimals)}%`;

export const getRiskColor = (risk) => {
  const map = {
    'Low': '#10d9a0',
    'Conservative': '#10d9a0',
    'Moderate': '#f0b429',
    'Moderate-High': '#f97316',
    'High': '#f43f5e',
    'Aggressive': '#f43f5e',
  };
  return map[risk] || '#8899bb';
};

export const getRiskLabel = (risk) => risk || 'Moderate';

export const getScoreGrade = (score) => {
  if (score >= 85) return { label: 'Excellent', color: '#10d9a0' };
  if (score >= 70) return { label: 'Strong', color: '#f0b429' };
  if (score >= 55) return { label: 'Good', color: '#3b82f6' };
  return { label: 'Fair', color: '#8899bb' };
};

export const getCategoryIcon = (category) => {
  const icons = {
    'Large Cap': '🏛️',
    'Mid Cap': '📈',
    'Small Cap': '🚀',
    'Hybrid': '⚖️',
    'Flexi Cap': '🎯',
    'ELSS': '💰',
    'Debt': '🔒',
  };
  return icons[category] || '📊';
};