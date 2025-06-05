import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useLayoutEffect, useEffect, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { UserType } from "../../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrders, setShowOrders] = useState(false); 
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#71b0ef",
      },

      headerLeft: () => (
        <Image
          source={require("../../assets/AnorMarket.png")}
          style={{ width: 140, height: 160, marginLeft: 16,marginBottom:4 }}
          resizeMode="contain"
        />
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginRight: 16,
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
          <AntDesign name="search1" size={24} color="black" />
        </View>
      ),
    });
  }, []);

  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://192.168.70.10:8000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchUserProfile();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("auth token cleared");
    navigation.replace("Login");
  };

  const handleFetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://192.168.70.10:8000/orders/${userId}`
      );
      const orders = response.data.orders;
      setOrders(orders);
      setShowOrders(true); 
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ marginLeft: 12, marginRight: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 6 }}>
        Xush kelibsiz  {user?.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
        <Pressable onPress={handleFetchOrders} style={styles.optionButton}>
          <Text style={styles.optionText}>Buyurtmalaringiz</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Cart")}
          style={styles.optionButton}
        >
          <Text style={styles.optionText}>Savatcha</Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
      <Pressable
  onPress={() =>
    navigation.getParent()?.navigate("Main", {
      screen: "Home",
    })
  }
  style={styles.optionButton}
>
  <Text style={styles.optionText}>Yana xarid qiling</Text>
</Pressable>


        <Pressable onPress={logout} style={styles.optionButton}>
          <Text style={styles.optionText}>Chiqish</Text>
        </Pressable>
      </View>

  
      {showOrders && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {loading ? (
            <Text style={{ fontSize: 16, marginTop: 10 }}>Yuklanmoqda...</Text>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <Pressable style={styles.orderCard} key={order._id}>
                {order.products.slice(0, 1).map((product) => (
                  <View style={{ marginVertical: 10 }} key={product._id}>
                    <Image
                      source={{ uri: product.image }}
                      style={{
                        width: 100,
                        height: 100,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                ))}
              </Pressable>
            ))
          ) : (
            <Text style={{ marginTop: 10 }}>Buyurtmalar topilmadi</Text>
          )}
        </ScrollView>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  optionButton: {
    padding: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 25,
    flex: 1,
  },
  optionText: {
    textAlign: "center",
    fontWeight: "600",
  },
  orderCard: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
