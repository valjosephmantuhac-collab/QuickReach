import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const EditDelivery = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [instructions, setInstructions] = useState("");
  const [price, setPrice] = useState("");
  const [priority, setPriority] = useState(0);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);

  // Fetch delivery data
  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const docRef = doc(db, "goals", id); // still "goals"
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setItemName(data.itemName || "");
          setCategory(data.category || "");
          setInstructions(data.instructions || "");
          setPrice(String(data.price || ""));
          setPriority(Number(data.priority) || 0);
          setStatus(data.status || "Pending");
        }
      } catch (error) {
        console.log("Error fetching delivery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [id]);

  const handleUpdate = async () => {
    if (!itemName || !price) {
      alert("Please enter Item Name and Price.");
      return;
    }

    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, {
        itemName,
        category,
        instructions,
        price: Number(price) || 0,
        priority,
        status,
      });

      Keyboard.dismiss();
      router.push("/goals"); // goes back to deliveries list
    } catch (error) {
      console.log("Error updating delivery:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Delivery Request</Text>

      {/* Item Name */}
      <View style={styles.card}>
        <Text style={styles.label}>Item Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter item name"
          value={itemName}
          onChangeText={setItemName}
        />
      </View>

      {/* Category */}
      <View style={styles.card}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Food, Documents"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      {/* Status */}
      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>
        <Picker
          selectedValue={status}
          onValueChange={(val) => setStatus(val)}
          style={styles.picker}
        >
          <Picker.Item label="Pending" value="Pending" />
          <Picker.Item label="Accepted" value="Accepted" />
          <Picker.Item label="On the Way" value="On the Way" />
          <Picker.Item label="Completed" value="Completed" />
        </Picker>
      </View>

      {/* Instructions */}
      <View style={styles.card}>
        <Text style={styles.label}>Special Instructions</Text>
        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Enter any special notes"
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />
      </View>

      {/* Price */}
      <View style={styles.card}>
        <Text style={styles.label}>Estimated Price (₱)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          keyboardType="numeric"
          value={price}
          onChangeText={(val) => setPrice(val.replace(/[^0-9]/g, ""))}
        />
      </View>

      {/* Priority */}
      <View style={styles.card}>
        <Text style={styles.label}>Urgency Level: {priority}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={priority}
          minimumTrackTintColor="#2563EB"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#2563EB"
          onValueChange={(val) => setPriority(val)}
        />
      </View>

      {/* Update Button */}
      <Pressable onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  );
};

export default EditDelivery;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F9FAFB", // light gray background
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
    color: "#111827",
  },
  picker: {
    width: "100%",
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 10,
  },
  button: {
    marginTop: 25,
    padding: 16,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
});
