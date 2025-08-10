import NetInfo from '@react-native-community/netinfo';
import { syncTrees } from '../services/treeService';
import { useEffect } from 'react';

export function useNetworkSync() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncTrees();
      }
    });

    // Also sync on first load
    syncTrees();

    return () => unsubscribe();
  }, []);
}
