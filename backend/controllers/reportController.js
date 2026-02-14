import asyncHandler from '../middleware/asyncHandler.js';
import Observation from '../models/Observation.js';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { calculateComplianceRate } from '../utils/helpers.js';

// @desc    Get dashboard stats
// @route   GET /api/reports/dashboard
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, department, ward } = req.query;

  const query = {};

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (department) query.department = department;
  if (ward) query.ward = ward;

  const totalObservations = await Observation.countDocuments(query);
  const observations = await Observation.find(query);

  const adherenceCount = observations.filter(o => o.adherence === 'adherence').length;
  const partialCount = observations.filter(o => o.adherence === 'partial').length;
  const missedCount = observations.filter(o => o.adherence === 'missed').length;

  const complianceRate = totalObservations > 0 
    ? ((adherenceCount / totalObservations) * 100).toFixed(1)
    : 0;

  const totalUsers = await User.countDocuments({ isActive: true });
  const totalSessions = await Session.countDocuments();

  res.status(200).json({
    success: true,
    stats: {
      totalObservations,
      totalUsers,
      totalSessions,
      complianceRate: parseFloat(complianceRate),
      breakdown: {
        adherence: adherenceCount,
        partial: partialCount,
        missed: missedCount,
      },
    },
  });
});

// @desc    Get compliance report
// @route   GET /api/reports/compliance
// @access  Private
export const getComplianceReport = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, department, ward } = req.query;

  const query = {};

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (department) query.department = department;
  if (ward) query.ward = ward;

  const observations = await Observation.find(query);

  // Canonical WHO 5 moments (so charts always show all 5 bars)
  const WHO_MOMENT_KEYS = ['before_patient', 'before_aseptic', 'after_body_fluid', 'after_patient', 'after_surroundings'];

  // Group by WHO moment
  const whoMomentsData = {};
  WHO_MOMENT_KEYS.forEach(m => {
    whoMomentsData[m] = { adherence: 0, partial: 0, missed: 0, total: 0 };
  });
  observations.forEach(obs => {
    if (whoMomentsData[obs.whoMoment]) {
      whoMomentsData[obs.whoMoment][obs.adherence]++;
      whoMomentsData[obs.whoMoment].total++;
    }
  });

  // Build report for all 5 moments (charts expect consistent categories)
  const whoMomentsReport = WHO_MOMENT_KEYS.map(moment => {
    const d = whoMomentsData[moment];
    const complianceRate = d.total > 0 ? ((d.adherence / d.total) * 100).toFixed(1) : '0';
    return { moment, ...d, complianceRate };
  });

  res.status(200).json({
    success: true,
    report: {
      totalObservations: observations.length,
      whoMoments: whoMomentsReport,
    },
  });
});
// @desc    Get department report
// @route   GET /api/reports/department/:department
// @access  Private
export const getDepartmentReport = asyncHandler(async (req, res, next) => {
const { startDate, endDate } = req.query;
const department = req.params.department;
const query = { department };
if (startDate || endDate) {
query.createdAt = {};
if (startDate) query.createdAt.$gte = new Date(startDate);
if (endDate) query.createdAt.$lte = new Date(endDate);
}
const observations = await Observation.find(query);
const users = await User.find({ department, isActive: true });
const totalObservations = observations.length;
const adherenceCount = observations.filter(o => o.adherence === 'adherence').length;
const complianceRate = totalObservations > 0
? ((adherenceCount / totalObservations) * 100).toFixed(1)
: 0;
res.status(200).json({
success: true,
report: {
department,
totalStaff: users.length,
totalObservations,
complianceRate: parseFloat(complianceRate),
},
});
});
// @desc    Get ward report
// @route   GET /api/reports/ward/:ward
// @access  Private
export const getWardReport = asyncHandler(async (req, res, next) => {
const { startDate, endDate } = req.query;
const ward = req.params.ward;
const query = { ward };
if (startDate || endDate) {
query.createdAt = {};
if (startDate) query.createdAt.$gte = new Date(startDate);
if (endDate) query.createdAt.$lte = new Date(endDate);
}
const observations = await Observation.find(query);
const totalObservations = observations.length;
const adherenceCount = observations.filter(o => o.adherence === 'adherence').length;
const complianceRate = totalObservations > 0
? ((adherenceCount / totalObservations) * 100).toFixed(1)
: 0;
res.status(200).json({
success: true,
report: {
ward,
totalObservations,
complianceRate: parseFloat(complianceRate),
},
});
});
// @desc    Get user report
// @route   GET /api/reports/user/:userId
// @access  Private
export const getUserReport = asyncHandler(async (req, res, next) => {
const { startDate, endDate } = req.query;
const userId = req.params.userId;
const query = { observedStaff: userId };
if (startDate || endDate) {
query.createdAt = {};
if (startDate) query.createdAt.$gte = new Date(startDate);
if (endDate) query.createdAt.$lte = new Date(endDate);
}
const observations = await Observation.find(query);
const user = await User.findById(userId);
if (!user) {
return res.status(404).json({
success: false,
message: 'User not found',
});
}
const totalObservations = observations.length;
const adherenceCount = observations.filter(o => o.adherence === 'adherence').length;
const complianceRate = totalObservations > 0
? ((adherenceCount / totalObservations) * 100).toFixed(1)
: 0;
res.status(200).json({
success: true,
report: {
user: {
name: user.name,
department: user.department,
designation: user.designation,
},
totalObservations,
totalPoints: user.totalPoints,
complianceRate: parseFloat(complianceRate),
},
});
});
// @desc    Get trend report
// @route   GET /api/reports/trends
// @access  Private
export const getTrendReport = asyncHandler(async (req, res, next) => {
const { days = 7 } = req.query;
const trends = [];
const today = new Date();
for (let i = parseInt(days) - 1; i >= 0; i--) {
const date = new Date(today);
date.setDate(date.getDate() - i);
date.setHours(0, 0, 0, 0);
const nextDate = new Date(date);
nextDate.setDate(nextDate.getDate() + 1);

const observations = await Observation.find({
  createdAt: {
    $gte: date,
    $lt: nextDate,
  },
});

const adherenceCount = observations.filter(o => o.adherence === 'adherence').length;
const complianceRate = observations.length > 0 
  ? ((adherenceCount / observations.length) * 100).toFixed(1)
  : 0;

trends.push({
  date: date.toISOString().split('T')[0],
  observations: observations.length,
  compliance: parseFloat(complianceRate),
});
}
res.status(200).json({
success: true,
trends,
});
});
// @desc    Get WHO moments distribution
// @route   GET /api/reports/who-moments
// @access  Private
export const getWHOMomentsDistribution = asyncHandler(async (req, res, next) => {
const { startDate, endDate } = req.query;
const query = {};
if (startDate || endDate) {
query.createdAt = {};
if (startDate) query.createdAt.$gte = new Date(startDate);
if (endDate) query.createdAt.$lte = new Date(endDate);
}
const observations = await Observation.find(query);
const distribution = observations.reduce((acc, obs) => {
if (!acc[obs.whoMoment]) {
acc[obs.whoMoment] = 0;
}
acc[obs.whoMoment]++;
return acc;
}, {});
res.status(200).json({
success: true,
distribution,
});
});

// @desc    Export report as PDF/Excel/CSV
// @route   GET /api/reports/export/:format
// @access  Private
export const exportReport = asyncHandler(async (req, res, next) => {
  const { format } = req.params;
  const { startDate, endDate, department, ward, reportType = 'compliance' } = req.query;

  const query = {};

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (department) query.department = department;
  if (ward) query.ward = ward;

  const observations = await Observation.find(query)
    .populate('auditor', 'name department')
    .populate('observedStaff', 'name department designation')
    .sort({ createdAt: -1 });

  // Check if there's data to export
  if (observations.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No data available for the selected filters. Please adjust your filters and try again.',
    });
  }

  // Calculate summary statistics
  const totalObservations = observations.length;
  const adherenceCount = observations.filter(o => o.adherence === 'adherence').length;
  const partialCount = observations.filter(o => o.adherence === 'partial').length;
  const missedCount = observations.filter(o => o.adherence === 'missed').length;
  const complianceRate = ((adherenceCount / totalObservations) * 100).toFixed(1);

  // Group by WHO moment
  const whoMomentsData = {};
  observations.forEach(obs => {
    if (!whoMomentsData[obs.whoMoment]) {
      whoMomentsData[obs.whoMoment] = { adherence: 0, partial: 0, missed: 0, total: 0 };
    }
    whoMomentsData[obs.whoMoment][obs.adherence]++;
    whoMomentsData[obs.whoMoment].total++;
  });

  const reportDate = new Date().toISOString().split('T')[0];
  const filterInfo = [
    startDate ? `From: ${startDate}` : '',
    endDate ? `To: ${endDate}` : '',
    department ? `Department: ${department}` : '',
    ward ? `Ward: ${ward}` : '',
  ].filter(Boolean).join(' | ') || 'All Data';

  if (format === 'csv') {
    // Generate CSV
    const csvHeader = 'Date,Observer,Observed Staff,Department,Ward,WHO Moment,Adherence,Notes\n';
    const csvRows = observations.map(obs => {
      return [
        new Date(obs.createdAt).toLocaleDateString(),
        obs.auditor?.name || 'N/A',
        obs.observedStaff?.name || 'N/A',
        obs.department || 'N/A',
        obs.ward || 'N/A',
        obs.whoMoment || 'N/A',
        obs.adherence || 'N/A',
        (obs.remarks || '').replace(/,/g, ';').replace(/\n/g, ' '),
      ].join(',');
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=hand_hygiene_report_${reportDate}.csv`);
    return res.send(csvContent);
  }

  if (format === 'excel' || format === 'xlsx') {
    // Generate simple XML-based Excel (works without external libraries)
    const excelContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Report">
    <Table>
      <Row>
        <Cell><Data ss:Type="String">AIIMS Hand Hygiene Compliance Report</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Generated: ${reportDate}</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Filters: ${filterInfo}</Data></Cell>
      </Row>
      <Row></Row>
      <Row>
        <Cell><Data ss:Type="String">Summary</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Total Observations</Data></Cell>
        <Cell><Data ss:Type="Number">${totalObservations}</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Compliance Rate</Data></Cell>
        <Cell><Data ss:Type="String">${complianceRate}%</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Adherence</Data></Cell>
        <Cell><Data ss:Type="Number">${adherenceCount}</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Partial</Data></Cell>
        <Cell><Data ss:Type="Number">${partialCount}</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">Missed</Data></Cell>
        <Cell><Data ss:Type="Number">${missedCount}</Data></Cell>
      </Row>
      <Row></Row>
      <Row>
        <Cell><Data ss:Type="String">Date</Data></Cell>
        <Cell><Data ss:Type="String">Observer</Data></Cell>
        <Cell><Data ss:Type="String">Observed Staff</Data></Cell>
        <Cell><Data ss:Type="String">Department</Data></Cell>
        <Cell><Data ss:Type="String">Ward</Data></Cell>
        <Cell><Data ss:Type="String">WHO Moment</Data></Cell>
        <Cell><Data ss:Type="String">Adherence</Data></Cell>
      </Row>
      ${observations.map(obs => `
      <Row>
        <Cell><Data ss:Type="String">${new Date(obs.createdAt).toLocaleDateString()}</Data></Cell>
        <Cell><Data ss:Type="String">${obs.auditor?.name || 'N/A'}</Data></Cell>
        <Cell><Data ss:Type="String">${obs.observedStaff?.name || 'N/A'}</Data></Cell>
        <Cell><Data ss:Type="String">${obs.department || 'N/A'}</Data></Cell>
        <Cell><Data ss:Type="String">${obs.ward || 'N/A'}</Data></Cell>
        <Cell><Data ss:Type="String">${obs.whoMoment || 'N/A'}</Data></Cell>
        <Cell><Data ss:Type="String">${obs.adherence || 'N/A'}</Data></Cell>
      </Row>`).join('')}
    </Table>
  </Worksheet>
</Workbook>`;

    res.setHeader('Content-Type', 'application/vnd.ms-excel');
    res.setHeader('Content-Disposition', `attachment; filename=hand_hygiene_report_${reportDate}.xls`);
    return res.send(excelContent);
  }

  // Default: Generate PDF (HTML that can be printed as PDF)
  const whoMomentsHTML = Object.keys(whoMomentsData).map(moment => {
    const data = whoMomentsData[moment];
    const rate = ((data.adherence / data.total) * 100).toFixed(1);
    return `
      <tr>
        <td>${moment}</td>
        <td>${data.total}</td>
        <td>${data.adherence}</td>
        <td>${data.partial}</td>
        <td>${data.missed}</td>
        <td>${rate}%</td>
      </tr>`;
  }).join('');

  const observationsHTML = observations.slice(0, 50).map(obs => `
    <tr>
      <td>${new Date(obs.createdAt).toLocaleDateString()}</td>
      <td>${obs.auditor?.name || 'N/A'}</td>
      <td>${obs.observedStaff?.name || 'N/A'}</td>
      <td>${obs.department || 'N/A'}</td>
      <td>${obs.whoMoment || 'N/A'}</td>
      <td style="color: ${obs.adherence === 'adherence' ? 'green' : obs.adherence === 'partial' ? 'orange' : 'red'}">
        ${obs.adherence || 'N/A'}
      </td>
    </tr>`).join('');

  const pdfHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Hand Hygiene Compliance Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
    h1 { color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
    h2 { color: #333; margin-top: 30px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .meta { color: #666; font-size: 14px; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
    .summary-card { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
    .summary-card h3 { margin: 0 0 5px 0; font-size: 14px; color: #666; }
    .summary-card p { margin: 0; font-size: 24px; font-weight: bold; }
    .adherence { color: #28a745; }
    .partial { color: #ffc107; }
    .missed { color: #dc3545; }
    .compliance { color: #007bff; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background-color: #007bff; color: white; }
    tr:nth-child(even) { background-color: #f8f9fa; }
    .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏥 AIIMS Hand Hygiene Compliance Report</h1>
  </div>
  
  <div class="meta">
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Filters:</strong> ${filterInfo}</p>
  </div>

  <h2>📊 Summary Statistics</h2>
  <div class="summary-grid">
    <div class="summary-card">
      <h3>Total Observations</h3>
      <p>${totalObservations}</p>
    </div>
    <div class="summary-card">
      <h3>Compliance Rate</h3>
      <p class="compliance">${complianceRate}%</p>
    </div>
    <div class="summary-card">
      <h3>Adherence</h3>
      <p class="adherence">${adherenceCount}</p>
    </div>
    <div class="summary-card">
      <h3>Missed</h3>
      <p class="missed">${missedCount}</p>
    </div>
  </div>

  <h2>🖐️ WHO 5 Moments Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>WHO Moment</th>
        <th>Total</th>
        <th>Adherence</th>
        <th>Partial</th>
        <th>Missed</th>
        <th>Rate</th>
      </tr>
    </thead>
    <tbody>
      ${whoMomentsHTML || '<tr><td colspan="6" style="text-align:center">No data available</td></tr>'}
    </tbody>
  </table>

  <h2>📋 Recent Observations ${observations.length > 50 ? '(Showing first 50)' : ''}</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Observer</th>
        <th>Observed Staff</th>
        <th>Department</th>
        <th>WHO Moment</th>
        <th>Adherence</th>
      </tr>
    </thead>
    <tbody>
      ${observationsHTML || '<tr><td colspan="6" style="text-align:center">No observations found</td></tr>'}
    </tbody>
  </table>

  <div class="footer">
    <p>AIIMS Hand Hygiene Portal | This report was automatically generated</p>
    <p>For questions, contact the Infection Control Team</p>
  </div>

  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Disposition', `inline; filename=hand_hygiene_report_${reportDate}.html`);
  return res.send(pdfHTML);
});
