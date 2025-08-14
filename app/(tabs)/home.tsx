// app/(tabs)/home.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  // Placeholder state (replace with actual logic from scan.tsx later)
  const treeCount = 0;
  const recentTrees: string[] = [];

  return (
    <ScrollView style={styles.container}>
      {/* Dashboard Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      {/* Tree Count Card */}
      <View style={styles.cardLarge}>
        <Text style={styles.cardTitle}>Number of Trees Scanned:</Text>
        <Text style={styles.cardNumber}>{treeCount}</Text>
      </View>

      {/* Recent Trees Card */}
      <View style={styles.cardSmall}>
        {recentTrees.length === 0 ? (
          <Text style={styles.noRecentText}>No recent scans yet.</Text>
        ) : (
          <View style={styles.recentList}>
            {recentTrees.map((tree, index) => (
              <Text key={index}>{tree}</Text>
            ))}
          </View>
        )}

        <View style={styles.iconButtons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Trivia / Info Card */}
      <View style={styles.cardTrivia}>
        <Text style={styles.triviaTitle}>Tree Trivia</Text>
        <Text style={styles.triviaText}>
          Trees communicate and share nutrients through an underground network of fungi
          called the 'Wood Wide Web'.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { backgroundColor: "#4b6b3c", padding: 15, alignItems: "center" },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  cardLarge: {
    margin: 15,
    backgroundColor: "#9fbf8b",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  cardTitle: { fontSize: 16, color: "#333" },
  cardNumber: { fontSize: 32, fontWeight: "bold", color: "#000" },

  cardSmall: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#4b6b3c",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noRecentText: { color: "#fff" },
  recentList: { flex: 1, flexDirection: "column", gap: 5 },
  iconButtons: { flexDirection: "row", gap: 10 },
  iconBtn: {
    backgroundColor: "#2e4d28",
    padding: 8,
    borderRadius: 8,
  },

  cardTrivia: {
    marginHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#d9ead3",
    padding: 15,
    borderRadius: 12,
  },
  triviaTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5, textAlign: "center" },
  triviaText: { fontSize: 14, textAlign: "center", color: "#333" },
});
