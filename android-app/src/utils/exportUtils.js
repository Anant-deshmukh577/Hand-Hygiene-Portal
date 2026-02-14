import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { Alert } from 'react-native';

/**
 * Prepare WHO Moments data for export
 * Transforms raw WHO moments data into a flat array of objects for CSV/Excel
 */
export const prepareWHOMomentsData = (whoMoments = []) => {
  if (!whoMoments || whoMoments.length === 0) return [];

  return whoMoments.map((m) => {
    const total = (m.adherence || 0) + (m.partial || 0) + (m.missed || 0);
    const complianceRate = total > 0 ? Math.round(((m.adherence || 0) / total) * 100) : 0;

    return {
      'WHO Moment': m.moment
        ? m.moment.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Unknown',
      'Adherence': m.adherence || 0,
      'Partial': m.partial || 0,
      'Missed': m.missed || 0,
      'Total': total,
      'Compliance Rate (%)': complianceRate,
    };
  });
};

/**
 * Export report data to PDF
 * Uses expo-print to generate and share a PDF file
 */
export const exportToPDF = async (reportData, fileName = 'report') => {
  try {
    const { stats = {}, complianceReport = {}, filters = {}, timestamp } = reportData;

    // Build HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Hand Hygiene Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #059669; font-size: 24px; border-bottom: 2px solid #059669; padding-bottom: 8px; }
            h2 { color: #6366f1; font-size: 18px; margin-top: 24px; }
            .stats-grid { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
            .stat-card { 
              flex: 1; min-width: 140px; padding: 16px; 
              border: 1px solid #e2e8f0; border-radius: 12px; 
              background-color: #f8fafc; text-align: center;
            }
            .stat-value { font-size: 28px; font-weight: 800; color: #1e293b; }
            .stat-label { font-size: 12px; color: #64748b; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { background-color: #6366f1; color: white; padding: 10px; text-align: left; font-size: 12px; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .filter-info { font-size: 12px; color: #64748b; margin: 8px 0; }
            .compliance-good { color: #059669; font-weight: 700; }
            .compliance-warn { color: #f59e0b; font-weight: 700; }
            .compliance-bad { color: #f43f5e; font-weight: 700; }
            .footer { margin-top: 32px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          </style>
        </head>
        <body>
          <h1>🏥 AIIMS Hand Hygiene Compliance Report</h1>
          
          <div class="filter-info">
            <strong>Period:</strong> ${filters.period || 'All Time'} | 
            <strong>Department:</strong> ${filters.department || 'All'} | 
            <strong>Ward:</strong> ${filters.ward || 'All'} |
            <strong>Generated:</strong> ${timestamp ? new Date(timestamp).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}
          </div>

          <h2>📊 Summary Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${stats.totalObservations || 0}</div>
              <div class="stat-label">Total Observations</div>
            </div>
            <div class="stat-card">
              <div class="stat-value ${
                (stats.complianceRate || 0) >= 90 ? 'compliance-good' : 
                (stats.complianceRate || 0) >= 75 ? 'compliance-warn' : 'compliance-bad'
              }">${stats.complianceRate || 0}%</div>
              <div class="stat-label">Compliance Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" style="color: #059669;">${stats.breakdown?.adherence || 0}</div>
              <div class="stat-label">Adherence</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" style="color: #f59e0b;">${stats.breakdown?.partial || 0}</div>
              <div class="stat-label">Partial</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" style="color: #f43f5e;">${stats.breakdown?.missed || 0}</div>
              <div class="stat-label">Missed</div>
            </div>
          </div>

          ${complianceReport?.whoMoments?.length > 0 ? `
            <h2>🖐️ WHO 5 Moments Breakdown</h2>
            <table>
              <thead>
                <tr>
                  <th>WHO Moment</th>
                  <th>Adherence</th>
                  <th>Partial</th>
                  <th>Missed</th>
                  <th>Total</th>
                  <th>Compliance</th>
                </tr>
              </thead>
              <tbody>
                ${(complianceReport.whoMoments || []).map((m) => {
                  const total = (m.adherence || 0) + (m.partial || 0) + (m.missed || 0);
                  const rate = total > 0 ? Math.round(((m.adherence || 0) / total) * 100) : 0;
                  const momentName = m.moment
                    ? m.moment.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                    : 'Unknown';
                  return `
                    <tr>
                      <td>${momentName}</td>
                      <td>${m.adherence || 0}</td>
                      <td>${m.partial || 0}</td>
                      <td>${m.missed || 0}</td>
                      <td>${total}</td>
                      <td class="${rate >= 90 ? 'compliance-good' : rate >= 75 ? 'compliance-warn' : 'compliance-bad'}">${rate}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          ` : ''}

          <div class="footer">
            This report was generated by AIIMS Hand Hygiene Portal Application.
            <br/>Data is subject to the filters applied at the time of generation.
          </div>
        </body>
      </html>
    `;

    // Generate PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: 'Share Hand Hygiene Report',
      });
      return true;
    } else {
      Alert.alert('Success', `PDF saved to: ${uri}`);
      return true;
    }
  } catch (error) {
    console.error('PDF Export Error:', error);
    Alert.alert('Export Failed', error.message || 'Failed to generate PDF');
    return false;
  }
};

/**
 * Export data to CSV format
 * Creates a CSV file and shares it
 */
export const exportToCSV = async (data, fileName = 'report') => {
  try {
    if (!data || data.length === 0) {
      Alert.alert('No Data', 'There is no data to export');
      return false;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Build CSV content
    const csvRows = [
      headers.join(','), // Header row
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape values containing commas or quotes
            const stringValue = String(value ?? '');
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          })
          .join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    
    // Use new File API
    const file = new File(Paths.document, `${fileName}_${Date.now()}.csv`);
    await file.write(csvContent);

    // Share the file
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'text/csv',
        dialogTitle: 'Share CSV Report',
      });
      return true;
    } else {
      Alert.alert('Success', `CSV saved to: ${file.uri}`);
      return true;
    }
  } catch (error) {
    console.error('CSV Export Error:', error);
    Alert.alert('Export Failed', error.message || 'Failed to generate CSV');
    return false;
  }
};

/**
 * Export data to Excel-compatible format (TSV with .xls extension)
 * Uses a simple tab-separated format that Excel can open
 */
export const exportToExcel = async (data, fileName = 'report') => {
  try {
    if (!data || data.length === 0) {
      Alert.alert('No Data', 'There is no data to export');
      return false;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Build HTML table that Excel can read
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="utf-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Report</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            table { border-collapse: collapse; }
            th { background-color: #6366f1; color: white; font-weight: bold; padding: 8px; border: 1px solid #ccc; }
            td { padding: 6px; border: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map((row) => `<tr>${headers.map((h) => `<td>${row[h] ?? ''}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Use new File API
    const file = new File(Paths.document, `${fileName}_${Date.now()}.xls`);
    await file.write(htmlContent);

    // Share the file
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/vnd.ms-excel',
        dialogTitle: 'Share Excel Report',
      });
      return true;
    } else {
      Alert.alert('Success', `Excel file saved to: ${file.uri}`);
      return true;
    }
  } catch (error) {
    console.error('Excel Export Error:', error);
    Alert.alert('Export Failed', error.message || 'Failed to generate Excel file');
    return false;
  }
};
