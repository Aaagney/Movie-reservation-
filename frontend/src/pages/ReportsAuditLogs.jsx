import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsAuditLogs = () => {
  const API_URL = 'http://localhost:5000/api';
  const CURRENT_USER = 'Morgan Adeyemi'; // Mock Active Administrator

  // Tabs: 'reports' or 'logs'
  const [activeTab, setActiveTab] = useState('reports');

  // Stats Card data
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: '0.00',
    totalMovies: 0,
    totalUsers: 0,
    totalTheatres: 0,
    totalCancelledBookings: 0
  });

  // Reports tab states
  const [salesPeriod, setSalesPeriod] = useState('daily');
  const [reportsFilter, setReportsFilter] = useState({ search: '', startDate: '', endDate: '' });
  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsData, setBookingsData] = useState([]);
  const [bookingsPagination, setBookingsPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [salesTrend, setSalesTrend] = useState([]);
  const [movieWise, setMovieWise] = useState([]);
  const [theatreWise, setTheatreWise] = useState([]);

  // Audit Logs tab states
  const [logsFilter, setLogsFilter] = useState({ search: '', action: '', startDate: '', endDate: '' });
  const [logsPage, setLogsPage] = useState(1);
  const [logsData, setLogsData] = useState([]);
  const [logsPagination, setLogsPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [loading, setLoading] = useState(false);
  const [actionTypes] = useState([
    'Login', 'View Report', 'Export PDF', 'Export CSV', 
    'Book Ticket', 'Cancel Booking', 'View Logs', 
    'Add Movie', 'Create Showtime', 'Update Theater', 'Database Seeding'
  ]);

  // Log action helper
  const logEvent = async (action, module, description) => {
    try {
      await fetch(`${API_URL}/audit-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: CURRENT_USER,
          action,
          module,
          description,
          ipAddress: '127.0.0.1'
        })
      });
      // If we are currently viewing logs, refresh them
      if (activeTab === 'logs') {
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Failed to log event:', err);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/reports/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  // Fetch Sales Trend
  const fetchSalesTrend = async () => {
    try {
      const queryParams = new URLSearchParams({
        period: salesPeriod,
        startDate: reportsFilter.startDate,
        endDate: reportsFilter.endDate
      });
      const res = await fetch(`${API_URL}/reports/sales?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setSalesTrend(data);
      }
    } catch (err) {
      console.error('Error loading sales trend:', err);
    }
  };

  // Fetch Movie-wise
  const fetchMovieWise = async () => {
    try {
      const res = await fetch(`${API_URL}/reports/movie-wise`);
      if (res.ok) {
        const data = await res.json();
        setMovieWise(data);
      }
    } catch (err) {
      console.error('Error loading movie-wise report:', err);
    }
  };

  // Fetch Theatre-wise
  const fetchTheatreWise = async () => {
    try {
      const res = await fetch(`${API_URL}/reports/theatre-wise`);
      if (res.ok) {
        const data = await res.json();
        setTheatreWise(data);
      }
    } catch (err) {
      console.error('Error loading theatre-wise report:', err);
    }
  };

  // Fetch Bookings List
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: reportsFilter.search,
        startDate: reportsFilter.startDate,
        endDate: reportsFilter.endDate,
        page: bookingsPage,
        limit: 10
      });
      const res = await fetch(`${API_URL}/reports/bookings-list?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setBookingsData(data.data);
        setBookingsPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Audit Logs List
  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: logsFilter.search,
        action: logsFilter.action,
        startDate: logsFilter.startDate,
        endDate: logsFilter.endDate,
        page: logsPage,
        limit: 10
      });
      const res = await fetch(`${API_URL}/audit-logs?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setLogsData(data.data);
        setLogsPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reload data when filters change
  useEffect(() => {
    if (activeTab === 'reports') {
      fetchStats();
      fetchSalesTrend();
      fetchMovieWise();
      fetchTheatreWise();
      fetchBookings();
    } else {
      fetchAuditLogs();
    }
  }, [activeTab, salesPeriod, bookingsPage, logsPage]);

  const handleReportsFilterSubmit = (e) => {
    e.preventDefault();
    setBookingsPage(1);
    fetchSalesTrend();
    fetchBookings();
    logEvent('Search Filter', 'Reports', `Filtered reports by date range (${reportsFilter.startDate || 'Any'} to ${reportsFilter.endDate || 'Any'}) and search: "${reportsFilter.search || 'none'}"`);
  };

  const handleLogsFilterSubmit = (e) => {
    e.preventDefault();
    setLogsPage(1);
    fetchAuditLogs();
    logEvent('Search Filter', 'Audit Logs', `Filtered audit logs by date, action: "${logsFilter.action || 'All'}", search: "${logsFilter.search || 'none'}"`);
  };

  const handleReportsFilterReset = () => {
    setReportsFilter({ search: '', startDate: '', endDate: '' });
    setBookingsPage(1);
    // Use state callback timing or trigger reload
    setTimeout(() => {
      fetchSalesTrend();
      fetchBookings();
    }, 50);
  };

  const handleLogsFilterReset = () => {
    setLogsFilter({ search: '', action: '', startDate: '', endDate: '' });
    setLogsPage(1);
    setTimeout(() => {
      fetchAuditLogs();
    }, 50);
  };

  // Helper date formatters
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatDateOnly = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // --- CSV EXPORT UTILITIES ---
  const exportBookingsToCSV = () => {
    if (bookingsData.length === 0) return alert('No booking data to export.');
    
    // Headers
    const headers = ['Booking ID', 'User Name', 'User Email', 'Movie Title', 'Theatre Name', 'Show Time', 'Booking Date', 'Price ($)', 'Status'];
    const rows = bookingsData.map(b => [
      b.booking_id,
      b.user_name,
      b.user_email,
      b.movie_title,
      b.theater_name,
      new Date(b.show_time).toLocaleString(),
      new Date(b.booking_date).toLocaleString(),
      b.total_price,
      b.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CineVault_Bookings_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logEvent('Export CSV', 'Reports', 'Exported paginated booking report entries to CSV format.');
  };

  const exportLogsToCSV = () => {
    if (logsData.length === 0) return alert('No audit logs to export.');

    const headers = ['Log ID', 'User Name', 'Action', 'Module', 'Description', 'Timestamp', 'IP Address'];
    const rows = logsData.map(l => [
      l.id,
      l.user_name,
      l.action,
      l.module,
      l.description,
      new Date(l.created_at).toLocaleString(),
      l.ip_address || '127.0.0.1'
    ]);

    const csvContent = [headers, ...rows].map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CineVault_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logEvent('Export CSV', 'Audit Logs', 'Exported paginated audit logs data to CSV format.');
  };

  // --- PDF EXPORT UTILITIES ---
  const exportBookingsToPDF = () => {
    if (bookingsData.length === 0) return alert('No booking data to export.');

    const doc = new jsPDF();
    
    // Theme Colors
    const primaryColor = [20, 18, 33]; // Dark Navy (#141221)
    const accentColor = [212, 140, 34]; // Gold (#d48c22)

    // Document Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CINÉVAULT', 15, 18);
    
    doc.setTextColor(...accentColor);
    doc.setFontSize(10);
    doc.text('REPORTS MODULE', 15, 25);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 140, 18);
    doc.text(`Generated By: ${CURRENT_USER} (Admin)`, 140, 24);

    // Title
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Sales Booking Report', 15, 48);

    // Filter status
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    const filterInfo = `Filters: Date Range: ${reportsFilter.startDate || 'All'} to ${reportsFilter.endDate || 'All'} | Search Query: "${reportsFilter.search || 'None'}"`;
    doc.text(filterInfo, 15, 54);

    // Table
    const tableHeaders = [['ID', 'User Name', 'Movie', 'Theatre', 'Show Time', 'Booking Date', 'Price', 'Status']];
    const tableData = bookingsData.map(b => [
      b.booking_id,
      b.user_name,
      b.movie_title,
      b.theater_name,
      formatDateOnly(b.show_time),
      formatDateOnly(b.booking_date),
      `$${b.total_price}`,
      b.status.toUpperCase()
    ]);

    doc.autoTable({
      startY: 60,
      head: tableHeaders,
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 9,
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 28 },
        2: { cellWidth: 32 },
        3: { cellWidth: 25 },
        4: { cellWidth: 22 },
        5: { cellWidth: 22 },
        6: { cellWidth: 15, halign: 'right' },
        7: { cellWidth: 18, halign: 'center' }
      },
      styles: {
        fontSize: 8,
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [248, 248, 250]
      }
    });

    doc.save(`CineVault_Bookings_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    logEvent('Export PDF', 'Reports', 'Generated and downloaded Booking sales report PDF.');
  };

  const exportLogsToPDF = () => {
    if (logsData.length === 0) return alert('No audit logs to export.');

    const doc = new jsPDF();
    const primaryColor = [20, 18, 33];
    const accentColor = [212, 140, 34];

    // Document Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CINÉVAULT', 15, 18);
    
    doc.setTextColor(...accentColor);
    doc.setFontSize(10);
    doc.text('AUDIT LOG MODULE', 15, 25);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 140, 18);
    doc.text(`Generated By: ${CURRENT_USER} (Admin)`, 140, 24);

    // Title
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('System Activity Audit Logs', 15, 48);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    const filterInfo = `Filters: Action: ${logsFilter.action || 'All'} | Search Query: "${logsFilter.search || 'None'}"`;
    doc.text(filterInfo, 15, 54);

    // Table
    const tableHeaders = [['Log ID', 'User Name', 'Action', 'Module', 'Description', 'Date & Time', 'IP Address']];
    const tableData = logsData.map(l => [
      l.id,
      l.user_name,
      l.action,
      l.module,
      l.description,
      new Date(l.created_at).toLocaleString(),
      l.ip_address || '127.0.0.1'
    ]);

    doc.autoTable({
      startY: 60,
      head: tableHeaders,
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 9,
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 28 },
        2: { cellWidth: 28 },
        3: { cellWidth: 20 },
        4: { cellWidth: 50 },
        5: { cellWidth: 28 },
        6: { cellWidth: 20, halign: 'center' }
      },
      styles: {
        fontSize: 8,
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [248, 248, 250]
      }
    });

    doc.save(`CineVault_Audit_Logs_${new Date().toISOString().split('T')[0]}.pdf`);
    logEvent('Export PDF', 'Audit Logs', 'Generated and downloaded system audit activity logs PDF.');
  };

  // SVG Chart Dimensions & Computations
  const getChartMaxVal = () => {
    if (salesTrend.length === 0) return 100;
    const maxRevenue = Math.max(...salesTrend.map(d => parseFloat(d.revenue)));
    return maxRevenue === 0 ? 100 : maxRevenue * 1.15; // 15% padding at top
  };

  const chartMaxVal = getChartMaxVal();
  const chartHeight = 160;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  return (
    <div className="admin-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 4%' }}>
      {/* HEADER SECTION */}
      <div className="admin-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="admin-header-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 800 }}>
            Reports & Audit Logs
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Monitor sales statistics, movie/theater aggregates, and system activities.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="admin-badge">SYSTEM CONTROL</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success-color)', display: 'inline-block' }}></span>
            API Connected
          </span>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="stats-card">
          <div className="stats-card-label">Total Bookings</div>
          <div className="stats-card-value" style={{ color: 'var(--text-white)' }}>{stats.totalBookings}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-label">Total Revenue</div>
          <div className="stats-card-value" style={{ color: 'var(--accent-color)' }}>${stats.totalRevenue}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-label">Active Movies</div>
          <div className="stats-card-value" style={{ color: 'var(--text-white)' }}>{stats.totalMovies}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-label">Total Users</div>
          <div className="stats-card-value" style={{ color: 'var(--text-white)' }}>{stats.totalUsers}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-label">Active Theatres</div>
          <div className="stats-card-value" style={{ color: 'var(--text-white)' }}>{stats.totalTheatres}</div>
        </div>
        <div className="stats-card" style={{ borderLeft: '3px solid var(--danger-color)' }}>
          <div className="stats-card-label">Cancelled Bookings</div>
          <div className="stats-card-value" style={{ color: 'var(--danger-color)' }}>{stats.totalCancelledBookings}</div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="admin-tabs" style={{ display: 'flex', marginBottom: '2rem' }}>
        <div 
          className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports & Sales Trend
        </div>
        <div 
          className={`admin-tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          System Audit Logs
        </div>
      </div>

      {/* TABS CONTAINER */}
      {activeTab === 'reports' ? (
        /* REPORTS VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* SALES TREND SECTION */}
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>Sales & Bookings Revenue Trend</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visualize income growth across daily, weekly, or monthly intervals.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {['daily', 'weekly', 'monthly'].map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setSalesPeriod(p);
                      logEvent('Change Report View', 'Reports', `Switched Sales Trend aggregation period to: ${p}`);
                    }}
                    style={{
                      background: salesPeriod === p ? 'var(--accent-color)' : 'transparent',
                      color: salesPeriod === p ? 'var(--bg-color)' : 'var(--text-white)',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* CHART */}
            {salesTrend.length === 0 ? (
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No trend data matching filter criteria.
              </div>
            ) : (
              <div style={{ width: '100%', overflowX: 'auto', padding: '1rem 0' }}>
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', minWidth: '450px', height: 'auto', maxHeight: '250px' }}>
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
                    const y = paddingY + (chartHeight - paddingY * 2) * (1 - r);
                    const label = (chartMaxVal * r).toFixed(0);
                    return (
                      <g key={idx}>
                        <line x1={paddingX} y1={y} x2={chartWidth - paddingY} y2={y} stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3 3" />
                        <text x={paddingX - 8} y={y + 3} fill="var(--text-muted)" fontSize="8" textAnchor="end">${label}</text>
                      </g>
                    );
                  })}
                  
                  {/* Chart Bars */}
                  {salesTrend.map((data, idx) => {
                    const barWidth = Math.max(10, ((chartWidth - paddingX - paddingY) / salesTrend.length) * 0.6);
                    const gap = ((chartWidth - paddingX - paddingY) / salesTrend.length) * 0.4;
                    const x = paddingX + idx * (barWidth + gap) + gap / 2;
                    const valHeight = (parseFloat(data.revenue) / chartMaxVal) * (chartHeight - paddingY * 2);
                    const y = chartHeight - paddingY - valHeight;
                    
                    return (
                      <g key={idx} className="chart-bar-group">
                        {/* Hover Tooltip trigger box */}
                        <rect 
                          x={x} 
                          y={paddingY} 
                          width={barWidth} 
                          height={chartHeight - paddingY * 2} 
                          fill="transparent" 
                          style={{ cursor: 'pointer' }}
                        >
                          <title>{`Date: ${data.date}\nRevenue: $${data.revenue}\nBookings: ${data.bookingsCount}`}</title>
                        </rect>
                        {/* The visible bar */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={Math.max(2, valHeight)}
                          rx="2"
                          fill="var(--accent-color)"
                          opacity="0.85"
                          style={{ transition: 'all 0.3s ease' }}
                        />
                        {/* Label */}
                        <text 
                          x={x + barWidth / 2} 
                          y={chartHeight - 8} 
                          fill="var(--text-muted)" 
                          fontSize="7" 
                          textAnchor="middle"
                          transform={`rotate(-15, ${x + barWidth / 2}, ${chartHeight - 8})`}
                        >
                          {data.date.substring(5)}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Axis Line */}
                  <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingY} y2={chartHeight - paddingY} stroke="var(--border-color)" strokeWidth="1" />
                </svg>
              </div>
            )}
          </div>

          {/* DUAL BREAKDOWNS (MOVIE & THEATRE) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* MOVIE-WISE SALES CARD */}
            <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-white)' }}>
                Movie-wise Performance
              </h3>
              <div className="table-container" style={{ border: 'none', padding: 0 }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ padding: '0.6rem' }}>Film Title</th>
                      <th style={{ padding: '0.6rem' }}>Genre</th>
                      <th style={{ padding: '0.6rem', textAlign: 'center' }}>Bookings</th>
                      <th style={{ padding: '0.6rem', textAlign: 'right' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movieWise.map((m, idx) => (
                      <tr key={m.id || idx}>
                        <td style={{ fontWeight: 700, padding: '0.6rem' }}>{m.title}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.6rem' }}>{m.genre}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600, padding: '0.6rem' }}>{m.bookingsCount}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-color)', padding: '0.6rem' }}>${m.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* THEATRE-WISE SALES CARD */}
            <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-white)' }}>
                Theatre-wise Performance
              </h3>
              <div className="table-container" style={{ border: 'none', padding: 0 }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ padding: '0.6rem' }}>Theatre Name</th>
                      <th style={{ padding: '0.6rem' }}>Capacity Specs</th>
                      <th style={{ padding: '0.6rem', textAlign: 'center' }}>Bookings</th>
                      <th style={{ padding: '0.6rem', textAlign: 'right' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {theatreWise.map((t, idx) => (
                      <tr key={t.id || idx}>
                        <td style={{ fontWeight: 700, padding: '0.6rem' }}>{t.name}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.6rem' }}>{t.capacity_desc}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600, padding: '0.6rem' }}>{t.bookingsCount}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-color)', padding: '0.6rem' }}>${t.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* MAIN BOOKINGS LOG TABLE */}
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            
            {/* Filters Form */}
            <form onSubmit={handleReportsFilterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                  Detailed Booking Records
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={exportBookingsToCSV} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    📥 Export CSV
                  </button>
                  <button type="button" onClick={exportBookingsToPDF} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                    📄 Export PDF
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 2, minWidth: '220px', marginBottom: 0 }}>
                  <label className="form-label">Search Query</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Search Booking ID, Member name, or Movie..." 
                    value={reportsFilter.search} 
                    onChange={(e) => setReportsFilter({ ...reportsFilter, search: e.target.value })} 
                  />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
                  <label className="form-label">Start Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={reportsFilter.startDate} 
                    onChange={(e) => setReportsFilter({ ...reportsFilter, startDate: e.target.value })} 
                  />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
                  <label className="form-label">End Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={reportsFilter.endDate} 
                    onChange={(e) => setReportsFilter({ ...reportsFilter, endDate: e.target.value })} 
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', minWidth: '180px' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', flex: 1 }}>
                    Search
                  </button>
                  <button type="button" onClick={handleReportsFilterReset} className="btn btn-secondary" style={{ padding: '0.75rem 1rem' }}>
                    Reset
                  </button>
                </div>
              </div>
            </form>

            {/* Bookings Table */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading records...</div>
            ) : bookingsData.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings matched your filter criteria.</div>
            ) : (
              <>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>User Name</th>
                        <th>Movie Title</th>
                        <th>Theater</th>
                        <th>Show Time</th>
                        <th>Booking Date</th>
                        <th>Paid Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsData.map((booking) => (
                        <tr key={booking.booking_id}>
                          <td style={{ fontWeight: 700, color: 'var(--accent-color)' }}>{booking.booking_id}</td>
                          <td>
                            <div>{booking.user_name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{booking.user_email}</div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{booking.movie_title}</td>
                          <td>{booking.theater_name}</td>
                          <td style={{ fontSize: '0.85rem' }}>{formatDateTime(booking.show_time)}</td>
                          <td style={{ fontSize: '0.85rem' }}>{formatDateTime(booking.booking_date)}</td>
                          <td style={{ fontWeight: 700 }}>${booking.total_price}</td>
                          <td>
                            <span className={`ticket-status ${booking.status}`} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Showing page <strong>{bookingsPagination.page}</strong> of <strong>{bookingsPagination.totalPages || 1}</strong> (Total: {bookingsPagination.total} items)
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setBookingsPage(p => Math.max(1, p - 1))} 
                      disabled={bookingsPagination.page === 1}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', opacity: bookingsPagination.page === 1 ? 0.5 : 1, cursor: bookingsPagination.page === 1 ? 'not-allowed' : 'pointer' }}
                    >
                      ◀ Previous
                    </button>
                    <button 
                      onClick={() => setBookingsPage(p => Math.min(bookingsPagination.totalPages, p + 1))} 
                      disabled={bookingsPagination.page === bookingsPagination.totalPages || bookingsPagination.totalPages === 0}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', opacity: (bookingsPagination.page === bookingsPagination.totalPages || bookingsPagination.totalPages === 0) ? 0.5 : 1, cursor: (bookingsPagination.page === bookingsPagination.totalPages || bookingsPagination.totalPages === 0) ? 'not-allowed' : 'pointer' }}
                    >
                      Next ▶
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>

        </div>
      ) : (
        /* AUDIT LOGS VIEW */
        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          
          {/* Filters Form */}
          <form onSubmit={handleLogsFilterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                  System Activities & Event Audit Trail
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  A permanent, immutable record of administrator and user interactions across the application.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={exportLogsToCSV} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  📥 Export CSV
                </button>
                <button type="button" onClick={exportLogsToPDF} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  📄 Export PDF
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 2, minWidth: '200px', marginBottom: 0 }}>
                <label className="form-label">Search Keywords</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Search user name, description, module..." 
                  value={logsFilter.search} 
                  onChange={(e) => setLogsFilter({ ...logsFilter, search: e.target.value })} 
                />
              </div>
              
              <div className="form-group" style={{ flex: 1, minWidth: '140px', marginBottom: 0 }}>
                <label className="form-label">Filter Action</label>
                <select 
                  className="form-input" 
                  style={{ background: 'var(--bg-input)' }}
                  value={logsFilter.action} 
                  onChange={(e) => setLogsFilter({ ...logsFilter, action: e.target.value })}
                >
                  <option value="">-- All Actions --</option>
                  {actionTypes.map(act => <option key={act} value={act}>{act}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: '130px', marginBottom: 0 }}>
                <label className="form-label">From Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={logsFilter.startDate} 
                  onChange={(e) => setLogsFilter({ ...logsFilter, startDate: e.target.value })} 
                />
              </div>
              
              <div className="form-group" style={{ flex: 1, minWidth: '130px', marginBottom: 0 }}>
                <label className="form-label">To Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={logsFilter.endDate} 
                  onChange={(e) => setLogsFilter({ ...logsFilter, endDate: e.target.value })} 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', minWidth: '160px' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', flex: 1 }}>
                  Search
                </button>
                <button type="button" onClick={handleLogsFilterReset} className="btn btn-secondary" style={{ padding: '0.75rem 1rem' }}>
                  Reset
                </button>
              </div>
            </div>
          </form>

          {/* Audit Logs Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading audit logs...</div>
          ) : logsData.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No audit log entries matching filters.</div>
          ) : (
            <>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Log ID</th>
                      <th>User/Admin</th>
                      <th>Action</th>
                      <th>Module</th>
                      <th>Description</th>
                      <th>Date & Time</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logsData.map((log) => (
                      <tr key={log.id}>
                        <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>#{log.id}</td>
                        <td style={{ fontWeight: 600 }}>{log.user_name}</td>
                        <td>
                          <span 
                            style={{ 
                              background: 'rgba(212, 140, 34, 0.1)', 
                              color: 'var(--accent-color)', 
                              border: '1px solid rgba(212, 140, 34, 0.3)',
                              padding: '0.15rem 0.4rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.module}</td>
                        <td style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>{log.description}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDateTime(log.created_at)}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{log.ip_address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Showing page <strong>{logsPagination.page}</strong> of <strong>{logsPagination.totalPages || 1}</strong> (Total: {logsPagination.total} items)
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => setLogsPage(p => Math.max(1, p - 1))} 
                    disabled={logsPagination.page === 1}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', opacity: logsPagination.page === 1 ? 0.5 : 1, cursor: logsPagination.page === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    ◀ Previous
                  </button>
                  <button 
                    onClick={() => setLogsPage(p => Math.min(logsPagination.totalPages, p + 1))} 
                    disabled={logsPagination.page === logsPagination.totalPages || logsPagination.totalPages === 0}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', opacity: (logsPagination.page === logsPagination.totalPages || logsPagination.totalPages === 0) ? 0.5 : 1, cursor: (logsPagination.page === logsPagination.totalPages || logsPagination.totalPages === 0) ? 'not-allowed' : 'pointer' }}
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
};

export default ReportsAuditLogs;
