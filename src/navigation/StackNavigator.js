import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoginScrin from "../screens/LoginScrin";
import RegisterScrin from "../screens/RegisterScrin";
import HomeScrin from "../screens/HomeScrin";
import ProductInfoScreen from "../screens/ProductInfoScreen";
import AddAddresscreen from "../screens/AddAddresscreen";
import AddresScreen from "../screens/AddresScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CartScreen from "../screens/CartScreen";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScrin}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "#9a42eb", fontWeight: "bold" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="#9a42eb" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarLabelStyle: { color: "#9a42eb", fontWeight: "bold" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={24} color="#9a42eb" />
            ) : (
              <Ionicons name="person-outline" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: "Cart",
          tabBarLabelStyle: { color: "#9a42eb", fontWeight: "bold" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="cart" size={24} color="#9a42eb" />
            ) : (
              <Ionicons name="cart-outline" size={24} color="black" />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScrin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScrin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Info"
        component={ProductInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Address"
        component={AddAddresscreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Add"
        component={AddresScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});