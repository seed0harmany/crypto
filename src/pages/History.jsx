import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Download, Filter, Search, Calendar, TrendingUp, DollarSign, ArrowLeftRight, Award } from 'lucide-react';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Generate 100+ transactions for the year
  const generateTransactions = () => {
    const transactions = [];
    const types = [
      { type: 'Deposit', category: 'Deposits', positive: true },
      { type: 'Market Buy', category: 'Trades', positive: false },
      { type: 'Market Sell', category: 'Trades', positive: true },
      { type: 'Staking Rewards', category: 'Rewards', positive: true },
      { type: 'Yield Interest', category: 'Rewards', positive: true },
      { type: 'Wire Withdrawal', category: 'Deposits', positive: false },
      { type: 'Crypto Deposit', category: 'Deposits', positive: true },
      { type: 'Liquidity Pool Rewards', category: 'Rewards', positive: true },
      { type: 'Investment Maturity', category: 'Investments', positive: true },
      { type: 'Fixed Yield Payout', category: 'Investments', positive: true }
    ];

    const assets = [
      { name: 'Bitcoin', symbol: 'BTC', subtext: 'Coinbase Commerce Gateway' },
      { name: 'Ethereum', symbol: 'ETH', subtext: 'Kraken OTC Desk' },
      { name: 'Tether USDT', symbol: 'USDT', subtext: 'Bitpay Gateway (ERC-20)' },
      { name: 'Binance Coin', symbol: 'BNB', subtext: 'Binance OTC' },
      { name: 'Litecoin', symbol: 'LTC', subtext: 'Coinbase Prime' },
      { name: 'Cardano', symbol: 'ADA', subtext: 'Kraken Exchange' },
      { name: 'Solana', symbol: 'SOL', subtext: 'FTX Relaunch' },
      { name: 'Polkadot', symbol: 'DOT', subtext: 'Binance Spot' }
    ];

    const statuses = ['Confirmed', 'Settled', 'Claimed', 'Processing', 'Complete'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 120; i++) {
      const txType = types[Math.floor(Math.random() * types.length)];
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const month = 11 - Math.floor(i / 10); // Distribute across the year
      const day = Math.floor(Math.random() * 28) + 1;
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);

      const amountBase = txType.type.includes('Deposit') || txType.type.includes('Withdrawal')
        ? Math.random() * 100000 + 10000
        : txType.type.includes('Rewards') || txType.type.includes('Interest')
        ? Math.random() * 5000 + 500
        : Math.random() * 50000 + 5000;

      const amount = txType.positive
        ? `+$${amountBase.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
        : `-$${amountBase.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

      const cryptoAmount = (amountBase / (Math.random() * 50000 + 10000)).toFixed(4);

      const details = [
        `TX: 0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)} (${Math.floor(Math.random() * 64) + 1}/64 confirmations)`,
        `Filled @ $${(Math.random() * 100000).toFixed(2)} • Fee: $${(Math.random() * 500).toFixed(2)}`,
        `Epoch ${Math.floor(Math.random() * 2000)} • APY: ${(Math.random() * 10 + 2).toFixed(1)}%`,
        `Wire Reference: WR-2025-${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(Math.floor(Math.random() * 99)).padStart(2, '0')}`,
        `Pool Share: ${(Math.random() * 0.1).toFixed(3)}% • Fees Earned`,
        `Week ${Math.floor(Math.random() * 52) + 1} • APY: ${(Math.random() * 10 + 2).toFixed(1)}%`
      ];

      transactions.push({
        id: `tx-${i}`,
        type: txType.type,
        category: txType.category,
        asset: asset.name,
        symbol: asset.symbol,
        subtext: asset.subtext,
        market: `${cryptoAmount} ${asset.symbol}`,
        detail: details[Math.floor(Math.random() * details.length)],
        status: status,
        date: `${months[month]} ${day}, 2025`,
        time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} EST`,
        amount: amount,
        positive: txType.positive,
        monthIndex: month,
        timestamp: new Date(2025, month, day, hour, minute).getTime()
      });
    }

    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  };

  const allTransactions = generateTransactions();

  // Filter transactions
  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch = searchTerm === '' || 
      tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.symbol.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || tx.category === filterType;

    const matchesMonth = filterMonth === 'All' || 
      tx.date.startsWith(filterMonth);

    return matchesSearch && matchesType && matchesMonth;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Statistics
  const totalDeposits = allTransactions
    .filter(tx => tx.positive && (tx.category === 'Deposits' || tx.type.includes('Deposit')))
    .reduce((sum, tx) => sum + parseFloat(tx.amount.replace(/[+$,]/g, '')), 0);

  const totalWithdrawals = allTransactions
    .filter(tx => !tx.positive && (tx.category === 'Deposits' || tx.type.includes('Withdrawal')))
    .reduce((sum, tx) => sum + parseFloat(tx.amount.replace(/[-$,]/g, '')), 0);

  const totalEarnings = allTransactions
    .filter(tx => tx.category === 'Rewards' || tx.category === 'Investments')
    .reduce((sum, tx) => sum + parseFloat(tx.amount.replace(/[+$,]/g, '')), 0);

  const totalTransactions = allTransactions.length;

  const SkeletonRow = () => (
    <tr>
      <td><div className="skeleton skeleton-text" style={{ width: '100px', height: '14px' }}></div></td>
      <td>
        <div className="skeleton skeleton-text" style={{ width: '120px', height: '14px', marginBottom: '4px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '180px', height: '12px', marginBottom: '4px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '80px', height: '12px', marginBottom: '4px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '200px', height: '11px' }}></div>
      </td>
      <td><div className="skeleton skeleton-pill" style={{ width: '80px', height: '28px' }}></div></td>
      <td>
        <div className="skeleton skeleton-text" style={{ width: '100px', height: '13px', marginBottom: '4px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '80px', height: '12px' }}></div>
      </td>
      <td><div className="skeleton skeleton-text" style={{ width: '120px', height: '16px', marginLeft: 'auto' }}></div></td>
    </tr>
  );

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
          color: #E2E8F0;
          min-height: 100vh;
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .skeleton {
          background: linear-gradient(90deg, rgba(30, 41, 59, 0.4) 0%, rgba(51, 65, 85, 0.6) 50%, rgba(30, 41, 59, 0.4) 100%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
          border-radius: 8px;
        }

        .skeleton-text { border-radius: 4px; }
        .skeleton-pill { border-radius: 8px; }
        .skeleton-icon { border-radius: 10px; }

        .history-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 32px 32px 64px;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 40px;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 36px;
          font-weight: 700;
          color: #F8FAFC;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
        }

        .page-subtitle {
          font-size: 16px;
          color: #94A3B8;
          font-weight: 400;
        }

        .export-btn {
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .export-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(59, 130, 246, 0.5);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
          backdrop-filter: blur(20px);
          border-radius: 14px;
          padding: 24px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
          border-color: rgba(148, 163, 184, 0.3);
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .stat-icon.blue {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .stat-icon.green {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .stat-icon.purple {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%);
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .stat-icon.amber {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .stat-label {
          font-size: 12px;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .stat-value {
          font-size: 26px;
          font-weight: 700;
          color: #F8FAFC;
          letter-spacing: -0.02em;
        }

        .filters-section {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
          backdrop-filter: blur(20px);
          border-radius: 14px;
          padding: 24px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          margin-bottom: 24px;
        }

        .filters-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 16px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-label {
          font-size: 12px;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }

        .search-box {
          position: relative;
        }

        .search-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 10px;
          padding: 12px 12px 12px 44px;
          color: #E2E8F0;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }

        .search-input:focus {
          border-color: #3B82F6;
          background: rgba(15, 23, 42, 0.8);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748B;
        }

        .filter-select {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 10px;
          padding: 12px 14px;
          color: #E2E8F0;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-select:focus {
          border-color: #3B82F6;
          background: rgba(15, 23, 42, 0.8);
        }

        .filter-select option {
          background: #1E293B;
          color: #E2E8F0;
        }

        .transactions-table-container {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 32px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          margin-bottom: 24px;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .table-title {
          font-size: 20px;
          font-weight: 700;
          color: #F8FAFC;
          letter-spacing: -0.02em;
        }

        .results-count {
          font-size: 14px;
          color: #64748B;
        }

        .transactions-table {
          width: 100%;
        }

        .transactions-table thead th {
          text-align: left;
          padding: 14px 16px;
          font-size: 11px;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          background: rgba(15, 23, 42, 0.4);
        }

        .transactions-table tbody tr {
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
          transition: all 0.2s;
        }

        .transactions-table tbody tr:hover {
          background: rgba(30, 41, 59, 0.4);
        }

        .transactions-table tbody td {
          padding: 20px 16px;
          font-size: 14px;
        }

        .transaction-type {
          font-weight: 600;
          color: #F8FAFC;
        }

        .transaction-asset {
          color: #E2E8F0;
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
        }

        .transaction-subtext {
          color: #64748B;
          font-size: 12px;
          display: block;
        }

        .transaction-market {
          color: #94A3B8;
          font-size: 13px;
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .transaction-detail {
          color: #64748B;
          font-size: 11px;
          display: block;
          font-family: 'Courier New', monospace;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid;
        }

        .status-confirmed {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border-color: rgba(16, 185, 129, 0.3);
        }

        .status-settled, .status-complete {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
          border-color: rgba(59, 130, 246, 0.3);
        }

        .status-claimed {
          background: rgba(139, 92, 246, 0.15);
          color: #8B5CF6;
          border-color: rgba(139, 92, 246, 0.3);
        }

        .status-processing {
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
          border-color: rgba(245, 158, 11, 0.3);
        }

        .transaction-date {
          color: #94A3B8;
          font-size: 13px;
          font-weight: 500;
        }

        .transaction-time {
          color: #64748B;
          font-size: 12px;
          display: block;
          margin-top: 4px;
        }

        .transaction-amount {
          font-weight: 700;
          font-size: 16px;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        .transaction-amount.positive {
          color: #10B981;
        }

        .transaction-amount.negative {
          color: #E2E8F0;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 32px;
        }

        .pagination-btn {
          padding: 10px 18px;
          border-radius: 8px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(148, 163, 184, 0.2);
          color: #E2E8F0;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(148, 163, 184, 0.4);
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pagination-btn.active {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          border-color: transparent;
          color: white;
        }

        .pagination-info {
          font-size: 14px;
          color: #94A3B8;
          padding: 0 16px;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters-row {
            grid-template-columns: 1fr;
          }

          .header-top {
            flex-direction: column;
            gap: 16px;
          }

          .export-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .history-container {
            padding: 20px 16px 40px;
          }

          .page-title {
            font-size: 28px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .transactions-table-container {
            padding: 24px 16px;
          }

          .transactions-table thead {
            display: none;
          }

          .transactions-table tbody tr {
            display: block;
            margin-bottom: 16px;
            background: rgba(15, 23, 42, 0.4);
            border-radius: 12px;
            padding: 16px;
            border: 1px solid rgba(148, 163, 184, 0.1);
          }

          .transactions-table tbody tr:hover {
            background: rgba(30, 41, 59, 0.5);
          }

          .transactions-table tbody td {
            display: block;
            padding: 8px 0;
            text-align: left !important;
            border: none;
          }

          .transactions-table tbody td::before {
            content: attr(data-label);
            font-size: 11px;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
            display: block;
            margin-bottom: 6px;
          }

          .transaction-amount {
            text-align: left !important;
            font-size: 18px;
          }

          .pagination {
            flex-wrap: wrap;
          }

          .pagination-info {
            width: 100%;
            text-align: center;
            padding: 12px 0;
          }
        }
      `}</style>

      <div className="history-container">
        <div className="page-header">
          <div className="header-top">
            <div>
              <h1 className="page-title">Transaction History</h1>
              <p className="page-subtitle">Complete record of all your crypto transactions in 2025</p>
            </div>
            <button className="export-btn">
              <Download size={18} />
              Export CSV
            </button>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {loading ? (
              <>
                {[1, 2, 3, 4].map(i => (
                  <div className="stat-card" key={i}>
                    <div className="skeleton skeleton-icon" style={{ width: '44px', height: '44px', marginBottom: '16px' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '120px', height: '12px', marginBottom: '8px' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '140px', height: '26px' }}></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="stat-card">
                  <div className="stat-icon blue">
                    <ArrowLeftRight size={22} color="#3B82F6" />
                  </div>
                  <div className="stat-label">Total Transactions</div>
                  <div className="stat-value">{totalTransactions}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green">
                    <ArrowUpRight size={22} color="#10B981" />
                  </div>
                  <div className="stat-label">Total Deposits</div>
                  <div className="stat-value">${totalDeposits.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon purple">
                    <ArrowDownRight size={22} color="#8B5CF6" />
                  </div>
                  <div className="stat-label">Total Withdrawals</div>
                  <div className="stat-value">${totalWithdrawals.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon amber">
                    <Award size={22} color="#F59E0B" />
                  </div>
                  <div className="stat-label">Total Earnings</div>
                  <div className="stat-value">${totalEarnings.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">Search</label>
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  className="search-input"
                  placeholder="Search by asset, type, or transaction..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">Type</label>
              <select
                className="filter-select"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Types</option>
                <option value="Deposits">Deposits</option>
                <option value="Trades">Trades</option>
                <option value="Rewards">Rewards</option>
                <option value="Investments">Investments</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Month</label>
              <select
                className="filter-select"
                value={filterMonth}
                onChange={(e) => {
                  setFilterMonth(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Months</option>
                <option value="Dec">December 2025</option>
                <option value="Nov">November 2025</option>
                <option value="Oct">October 2025</option>
                <option value="Sep">September 2025</option>
                <option value="Aug">August 2025</option>
                <option value="Jul">July 2025</option>
                <option value="Jun">June 2025</option>
                <option value="May">May 2025</option>
                <option value="Apr">April 2025</option>
                <option value="Mar">March 2025</option>
                <option value="Feb">February 2025</option>
                <option value="Jan">January 2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="transactions-table-container">
          <div className="table-header">
            <h2 className="table-title">All Transactions</h2>
            <span className="results-count">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </span>
          </div>

          <table className="transactions-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Asset & Details</th>
                <th>Status</th>
                <th>Date & Time</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  {[...Array(10)].map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </>
              ) : currentTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    No transactions found matching your filters
                  </td>
                </tr>
              ) : (
                currentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td data-label="Type" className="transaction-type">{tx.type}</td>
                    <td data-label="Asset & Details">
                      <span className="transaction-asset">{tx.asset}</span>
                      <span className="transaction-subtext">{tx.subtext}</span>
                      <span className="transaction-market">{tx.market}</span>
                      <span className="transaction-detail">{tx.detail}</span>
                    </td>
                    <td data-label="Status">
                      <span className={`status-badge status-${tx.status.toLowerCase()}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td data-label="Date & Time">
                      <span className="transaction-date">{tx.date}</span>
                      <span className="transaction-time">{tx.time}</span>
                    </td>
                    <td data-label="Amount">
                      <span className={`transaction-amount ${tx.positive ? 'positive' : 'negative'}`}>
                        {tx.amount}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {!loading && filteredTransactions.length > itemsPerPage && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (currentPage <= 3) {
                  pageNum = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = currentPage - 2 + idx;
                }

                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="pagination-info">...</span>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>

              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}