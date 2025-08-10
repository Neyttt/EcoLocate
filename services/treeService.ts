import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://ecolocate.page.gd/get_trees.php';
const STORAGE_KEY = 'trees';
const LAST_SYNC_KEY = 'trees_last_sync';

export async function syncTrees() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.status === 'success' && Array.isArray(data.data)) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
      await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      console.log('Trees synced successfully!');
      return data.data;
    } else {
      console.warn('Failed to sync trees:', data.message || 'Invalid response');
      return null;
    }
  } catch (error) {
    console.error('Error syncing trees:', error);
    return null;
  }
}

export async function getLocalTrees() {
  try {
    const trees = await AsyncStorage.getItem(STORAGE_KEY);
    return trees ? JSON.parse(trees) : [];
  } catch (error) {
    console.error('Error reading local trees:', error);
    return [];
  }
}

export async function getLastSyncTime() {
  return await AsyncStorage.getItem(LAST_SYNC_KEY);
}
