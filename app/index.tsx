import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingScreen() {
  const router = useRouter();

  const goToTabs = () => {
    router.replace('/(tabs)/home'); // Go directly to Home tab
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TreeApp</Text>
      <TouchableOpacity style={styles.button} onPress={goToTabs}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18 }
});
