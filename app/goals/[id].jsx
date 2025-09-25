import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig"
import * as Progress from "react-native-progress"
import { Ionicons } from "@expo/vector-icons"

const DeliveryDetail = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [delivery, setDelivery] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const unsub = onSnapshot(doc(db, "goals", id), (docSnap) => {
    if (docSnap.exists()) {
      setDelivery({ id: docSnap.id, ...docSnap.data() });
    } else {
      setDelivery(null);
    }
    setLoading(false);
  });

  return () => unsub(); // cleanup listener
}, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    )
  }

  if (!delivery) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Delivery not found</Text>
      </View>
    )
  }

  const statusColors = {
    Pending: "#9CA3AF",
    Accepted: "#2563EB",
    "On the Way": "#F59E0B",
    Completed: "#10B981",
  }

  const sections = [
    {
      label: "Category",
      value: delivery.category || "N/A",
      icon: "pricetag-outline",
    },
    {
      label: "Pickup Location",
      value: delivery.pickupLocation || "N/A",
      icon: "navigate-outline",
    },
    {
      label: "Drop-off Location",
      value: delivery.dropoffLocation || "N/A",
      icon: "location-outline",
    },
    {
      label: "Special Instructions",
      value: delivery.instructions || "N/A",
      icon: "document-text-outline",
    },
    {
      label: "Estimated Price",
      value: `₱${delivery.price || "0"}`,
      icon: "cash-outline",
    },
  ]

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{delivery.itemName}</Text>

      {/* Status Badge */}
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: statusColors[delivery.status] || "#9CA3AF" },
        ]}
      >
        <Text style={styles.statusText}>{delivery.status}</Text>
      </View>

      {/* Info Sections */}
      {sections.map((sec, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name={sec.icon} size={18} color="#1E3A8A" />
            <Text style={styles.label}>{sec.label}</Text>
          </View>
          <Text style={styles.value}>{sec.value}</Text>
        </View>
      ))}

      {/* Urgency */}
     {/* Urgency Section */}
<View style={styles.section}>
  <Text style={styles.label}>Urgency</Text>
  <Progress.Bar
    progress={(delivery.priority || 0) / 100}
    width={null}
    height={14}
    color={
      delivery.priority >= 75
        ? "#DC2626" // Critical - Red
        : delivery.priority >= 50
        ? "#F59E0B" // High - Orange
        : delivery.priority >= 25
        ? "#2563EB" // Medium - Blue
        : "#10B981" // Low - Green
    }
    unfilledColor="#E5EAF0"
    borderWidth={0}
    style={{ marginTop: 8, borderRadius: 8 }}
  />

  <Text
    style={[
      styles.priorityText,
      {
        color:
          delivery.priority >= 75
            ? "#DC2626"
            : delivery.priority >= 50
            ? "#F59E0B"
            : delivery.priority >= 25
            ? "#2563EB"
            : "#10B981",
      },
    ]}
  >
    {delivery.priority >= 75
      ? "Critical"
      : delivery.priority >= 50
      ? "High"
      : delivery.priority >= 25
      ? "Medium"
      : "Low"}
  </Text>
</View>


      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, { backgroundColor: "#2563EB" }]}
          onPress={() => router.push(`/goals/edit/${delivery.id}`)}
        >
          <Ionicons name="create-outline" size={18} color="white" />
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: "#B94E48" }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={18} color="white" />
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default DeliveryDetail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F9FF",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 12,
    marginTop: 30,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 25,
  },
  statusText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  value: {
    fontSize: 15,
    color: "#374151",
  },
 priorityText: {
  fontSize: 14,
  fontWeight: "600",
  marginTop: 8,
},

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 5,
    gap: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
})
