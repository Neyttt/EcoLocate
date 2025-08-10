// app/(tabs)/scan.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);

    // Only allow our app's custom QR scheme
    if (!data.startsWith('treescan://')) {
      Alert.alert(
        'Invalid QR Code',
        'Please download the Treescan app to scan this QR code.'
      );
      setTimeout(() => setScanned(false), 2000);
      return;
    }

    // Extract info from the QR code
    try {
      const url = new URL(data);
      const treeId = url.searchParams.get('id');

      Alert.alert('QR Code Scanned', `Tree ID: ${treeId}`);
      // Navigate or fetch data
      // router.push(`/tree/${treeId}`);

    } catch (error) {
      Alert.alert('Error', 'Could not read QR code.');
    }

    setTimeout(() => setScanned(false), 2000);
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
      <CameraView
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'], // Only scan QR codes
        }}
      />
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
