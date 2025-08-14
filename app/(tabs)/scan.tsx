// app/(tabs)/scan.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const lastScannedData = useRef<string | null>(null);
  const cameraRef = useRef(null);

  // Ask for camera permission on first load
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Manage camera activation only when tab is focused
  useFocusEffect(
    React.useCallback(() => {
      setIsActive(true);
      return () => setIsActive(false);
    }, [])
  );

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || data === lastScannedData.current) return; // Avoid duplicates
    lastScannedData.current = data;
    setScanned(true);

    // Only allow our app's custom QR scheme
    if (!data.startsWith('treescan://')) {
      Alert.alert('Invalid QR Code', 'Please download the Treescan app to scan this QR code.');
      resetScanner();
      return;
    }

    try {
      const url = new URL(data);
      const treeId = url.searchParams.get('id');

      if (!treeId) {
        Alert.alert('Invalid QR Code', 'Tree ID is missing.');
        resetScanner();
        return;
      }

      // Check internet connectivity
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        // Save offline for later sync
        const offlineScans = JSON.parse(await AsyncStorage.getItem('offlineScans') || '[]');
        offlineScans.push({ treeId, timestamp: Date.now() });
        await AsyncStorage.setItem('offlineScans', JSON.stringify(offlineScans));

        Alert.alert('Offline', `Tree ID ${treeId} saved for later sync.`);
      } else {
        // Online handling (fetch from server or navigate)
        Alert.alert('QR Code Scanned', `Tree ID: ${treeId}`);
        // router.push(`/tree/${treeId}`);
      }

    } catch (error) {
      Alert.alert('Error', 'Could not read QR code.');
    }

    resetScanner();
  };

  const resetScanner = () => {
    setTimeout(() => {
      setScanned(false);
      lastScannedData.current = null;
    }, 2000);
  };

  if (!permission) {
    return <View style={styles.center}><Text>Requesting camera permission...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to use the camera.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isActive && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          ref={cameraRef}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'], // Only scan QR codes
          }}
        />
      )}
      <View style={styles.overlay}>
        <Text style={styles.instructions}>Align the QR code inside the frame</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { marginTop: 10, backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  overlay: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  instructions: { color: '#fff', fontSize: 16 },
});

// CONTINUE ON MAKING THE QR CODE SHOW ERROR MESSAGE IF DIFFERENT SCANNER IS USE, unless app scanner is use
// UPDATE THE HOME.tsx to reflect if the scan.tsx file is working correctly
