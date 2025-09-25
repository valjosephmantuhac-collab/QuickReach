import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "expo-router";
import * as Progress from "react-native-progress";

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "goals"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDeliveries(list);
    });

    return unsubscribe;
  }, []);

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "goals", id);
      await deleteDoc(docRef);
      console.log("Delivery canceled:", id);
    } catch (error) {
      console.log("Error canceling delivery:", error);
    }
  };

  const statusColors = {
    Pending: "#9CA3AF", // gray
    Accepted: "#2563EB", // blue
    "On the Way": "#F59E0B", // orange
    Completed: "#10B981", // green
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.deliveryItem}
      onPress={() => router.push(`/goals/${item.id}`)}
    >
      <View style={styles.headerRow}>
        <Text style={styles.deliveryText}>
          {item.itemName || "Unnamed Delivery"}
        </Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[item.status] || "#9CA3AF" },
          ]}
        >
          <Text style={styles.statusText}>{item.status || "Pending"}</Text>
        </View>

        <Pressable onPress={() => setSelectedDelivery(item)}>
          <Text style={styles.dots}>⋮</Text>
        </Pressable>
      </View>

      {/* Urgency bar */}
      <View style={styles.progressRow}>
        <Progress.Bar
          progress={(item.priority || 0) / 100}
          width={150}
          height={8}
          color="#1E90FF"
          unfilledColor="#E5EAF0"
          borderWidth={0}
        />
        <Text style={styles.priorityLabel}>{item.priority || 0}/100</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Delivery Requests</Text>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No delivery requests yet. Create one!
          </Text>
        }
      />

      {/* Custom Modal for menu */}
      <Modal
        visible={!!selectedDelivery}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDelivery(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setSelectedDelivery(null)}
        >
          <View style={styles.modalContent}>
            <Pressable
              style={styles.modalItem}
              onPress={() => {
                router.push(`/goals/edit/${selectedDelivery.id}`);
                setSelectedDelivery(null);
              }}
            >
              <Text style={styles.modalText}>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.modalItem}
              onPress={() => {
                handleDelete(selectedDelivery.id);
                setSelectedDelivery(null);
              }}
            >
              <Text style={[styles.modalText, { color: "red" }]}>Delete</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>


    </SafeAreaView>
  );
};

export default Deliveries;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  deliveryItem: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    color: "#1E3A8A",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  priorityLabel: {
    fontSize: 12,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    color: "#888",
  },
  
  dots: {
    fontSize: 22,
    paddingHorizontal: 8,
    color: "#444",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
  },
});
