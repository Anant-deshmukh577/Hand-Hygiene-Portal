import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { Alert } from 'react-native';
import { observationService } from '../services/observationService';

/**
 * Download user's observation data as CSV
 * Fetches all observations for the current user and exports to CSV
 */
export const downloadMyData = async (userId) => {
  try {
    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return false;
    }

    // Fetch user's observations
    const response = await observationService.getUserObservations(userId);
    
    if (!response.observations || response.observations.length === 0) {
      Alert.alert('No Data', 'You have no observation data to download');
      return false;
    }

    // Transform observations to flat structure for CSV
    const data = response.observations.map((obs) => ({
      'Date': obs.createdAt ? new Date(obs.createdAt).toLocaleString('en-IN') : '',
      'WHO Moment': obs.whoMoment || '',
      'Compliance': obs.compliance || '',
      'Department': obs.department || '',
      'Ward': obs.ward || '',
      'Floor': obs.floor || '',
      'Observer': obs.observerName || '',
      'Notes': obs.notes || '',
    }));

    // Get headers
    const headers = Object.keys(data[0]);

    // Build CSV content
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
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
    const file = new File(Paths.document, `my_data_${Date.now()}.csv`);
    await file.write(csvContent);

    // Share the file
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'text/csv',
        dialogTitle: 'Download My Data',
      });
      return true;
    } else {
      Alert.alert('Success', `Data saved to: ${file.uri}`);
      return true;
    }
  } catch (error) {
    console.error('Download My Data Error:', error);
    Alert.alert('Download Failed', error.message || 'Failed to download your data');
    return false;
  }
};
