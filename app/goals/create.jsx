import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGoals } from "../../hooks/useGoals";
import { useRouter } from "expo-router";
import { auth } from "../../firebaseConfig";
import Slider from "@react-native-community/slider";

const Create = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [instructions, setInstructions] = useState("");
  const [priority, setPriority] = useState(0);
  const [price, setPrice] = useState("");

  const { createGoal } = useGoals();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!itemName.trim() || !dropoffLocation.trim()) return;

    await createGoal({
      itemName,
      category,
      pickupLocation,
      dropoffLocation,
      instructions,
      priority,
      price,
      status: "Pending",
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });

    // reset fields
    setItemName("");
    setCategory("");
    setPickupLocation("");
    setDropoffLocation("");
    setInstructions("");
    setPriority(0);
    setPrice("");

    Keyboard.dismiss();
    router.push("/goals");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Delivery Request</Text>

        {/* Card container for inputs */}
        <View style={styles.card}>
          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Jollibee 2pc Chickenjoy"
            value={itemName}
            onChangeText={setItemName}
          />

          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="Food, Drinks, Groceries..."
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.label}>Pickup Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Jollibee SM Downtown"
            value={pickupLocation}
            onChangeText={setPickupLocation}
          />

          <Text style={styles.label}>Drop-off Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., House #12, Block 3, Brgy. San Juan"
            value={dropoffLocation}
            onChangeText={setDropoffLocation}
          />

          <Text style={styles.label}>Special Instructions</Text>
          <TextInput
            style={[styles.input, { height: 90 }]}
            placeholder="e.g., Call when outside..."
            value={instructions}
            onChangeText={setInstructions}
            multiline
          />

          <Text style={styles.label}>Estimated Price (₱)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 250"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <View style={styles.sliderContainer}>
            <Text style={styles.label}>Urgency: {priority}/100</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={priority}
              onValueChange={setPriority}
              minimumTrackTintColor="#2563EB"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#2563EB"
            />
          </View>
        </View>

        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit Request</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
  },
  sliderContainer: {
    marginTop: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
