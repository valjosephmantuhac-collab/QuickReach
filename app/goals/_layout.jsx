import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { GoalsProvider } from '../../contexts/GoalsContext'
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebaseConfig"
import { useRouter } from "expo-router"
import { View, ActivityIndicator } from "react-native"

export default function GoalsLayout() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login")
      }
      setChecking(false)
    })
    return unsub
  }, [])

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <GoalsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1E3A8A',
          tabBarInactiveTintColor: 'grey',
        }}
      >
        {/* Deliveries List */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Deliveries',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                size={size}
                name={focused ? 'bicycle' : 'bicycle-outline'}
                color={color}
              />
            ),
          }}
        />

        {/* Create New Delivery */}
        <Tabs.Screen
          name="create"
          options={{
            title: 'Request',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                size={size}
                name={focused ? 'cube' : 'cube-outline'}
                color={color}
              />
            ),
          }}
        />

        {/* Hidden screens */}
        <Tabs.Screen name="edit/[id]" options={{ href: null }} />
        <Tabs.Screen name="[id]" options={{ href: null }} />
      </Tabs>
    </GoalsProvider>
  )
}
