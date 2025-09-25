import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Quick Reach</Text>
        <Pressable onPress={() => signOut(auth)} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color="#1E3A8A" />
        </Pressable>
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>Welcome Back</Text>
      <Text style={styles.subtitle}>What would you like to do today?</Text>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.card, { backgroundColor: "#2563EB" }]}
          onPress={() => router.push("/goals")}
        >
          <Ionicons name="cube-outline" size={28} color="white" />
          <Text style={styles.cardText}>View Deliveries</Text>
        </Pressable>

        <Pressable
          style={[styles.card, { backgroundColor: "#10B981" }]}
          onPress={() => router.push("/goals/create")}
        >
          <Ionicons name="add-circle-outline" size={28} color="white" />
          <Text style={styles.cardText}>New Delivery</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F9FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  logoutButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#E5EAF0",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 30,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 40,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
