import "react-native-get-random-values";
import { StyleSheet, Text, View, TextInput, ScrollView, Alert,Image } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Pressable } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import jwtDecode from "jwt-decode";
import axios from "axios";

export default function AddressScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const editingAddress = route.params?.item || null;

  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressId, setAddressId] = useState(null);

  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Xatolik", "Token topilmadi, iltimos qayta kiring");
          navigation.navigate("Login");
          return;
        }
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (err) {
        Alert.alert("Xatolik", "Foydalanuvchi aniqlanmadi");
        navigation.navigate("Login");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (editingAddress) {
      setRegion(editingAddress.region || "");
      setCity(editingAddress.city || "");
      setMobileNo(editingAddress.mobileNo || "");
      setHouseNo(editingAddress.houseNo || "");
      setStreet(editingAddress.street || "");
      setLandmark(editingAddress.landmark || "");
      setPostalCode(editingAddress.postalCode || "");
      setAddressId(editingAddress._id || null);
    }
  }, [editingAddress]);

  const handleSave = async () => {
    if (!region || !city || !mobileNo || !houseNo || !street) {
      Alert.alert("Xatolik", "Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    const token = await AsyncStorage.getItem("authToken");
    if (!token || !userId) {
      Alert.alert("Xatolik", "Token yoki foydalanuvchi aniqlanmadi");
      return;
    }

    const addressData = {
      userId,
      address: {
        region,
        city,
        mobileNo,
        houseNo,
        street,
        landmark,
        postalCode,
      },
    };

    try {
      if (addressId) {
      
        await axios.put(
          `http://192.168.100.213:8000/addresses/${userId}/${addressId}`,
          {
            region,
            city,
            mobileNo,
            houseNo,
            street,
            landmark,
            postalCode,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Alert.alert("Muvaffaqiyat", "Manzil yangilandi");
      } else {
        
        await axios.post(
          `http://192.168.165.10:8000/addresses`,
          addressData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Alert.alert("Muvaffaqiyat", "Manzil qo‘shildi");
      }

      setRegion("");
      setCity("");
      setMobileNo("");
      setHouseNo("");
      setStreet("");
      setLandmark("");
      setPostalCode("");
      setTimeout(() => navigation.goBack(), 700);
    } catch (err) {
      console.log("Xatolik:", err.response?.data || err.message);
      Alert.alert(
        "Xatolik",
        err.response?.data?.message || "Manzilni saqlashda xatolik yuz berdi"
      );
    }
  };

  return (
      <ScrollView style={{ marginTop: 40 }}>
  
       <View>
       <View style={{ height: 53,  backgroundColor: "#9a42eb",alignItems:'center',justifyContent:'center',flexDirection:'row' }} >
       <Text View style={{ fontSize:25,color:"white",fontWeight:'500' }}>Anor Market   </Text>
       <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5721/5721996.png' }}
          style={{ width: 40, height: 40 }}
        />
     </View>
  
       </View>
  
        <View style={{ padding: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {addressId ? "Manzilni tahrirlash" : "Yangi yetkazib berish manzilini qo‘shish"}
          </Text>
  
          <TextInput
            style={{
              marginTop: 8,
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 6,
              backgroundColor: "#fff",
              fontSize: 15,
            }}
            placeholder="Xorazm viloyati"
            placeholderTextColor="gray"
            value={region}
            onChangeText={setRegion}
          />
  
          <View style={{ marginVertical: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Shaxar nomi</Text>
            <TextInput
              style={{
                marginTop: 8,
                padding: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                borderRadius: 6,
                backgroundColor: "#fff",
                fontSize: 15,
              }}
              placeholder="Urgan shaxari"
              placeholderTextColor="gray"
              value={city}
              onChangeText={setCity}
            />
          </View>
  
          <View style={{ marginVertical: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Telefon raqami
            </Text>
            <TextInput
              style={{
                marginTop: 8,
                padding: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                borderRadius: 6,
                backgroundColor: "#fff",
                fontSize: 15,
              }}
              placeholder="+998883640108"
              placeholderTextColor="gray"
              value={mobileNo}
              onChangeText={setMobileNo}
              keyboardType="phone-pad"
            />
          </View>
  
          <View style={{ marginVertical: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}> Kvartira, uy raqami, bino, kompaniya </Text>
            <TextInput
              style={{
                marginTop: 8,
                padding: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                borderRadius: 6,
                backgroundColor: "#fff",
                fontSize: 15,
              }}
              placeholder="Avto_exclusive"
              placeholderTextColor="gray"
              value={houseNo}
              onChangeText={setHouseNo}
            />
          </View>
  
          <View style={{ marginVertical: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Hudud, ko'cha, sektor</Text>
            <TextInput
              style={{
                marginTop: 8,
                padding: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                borderRadius: 6,
                backgroundColor: "#fff",
                fontSize: 15,
              }}
              placeholder="Airaport yo'li 111-uy"
              placeholderTextColor="gray"
              value={street}
              onChangeText={setStreet}
            />
          </View>
  
          <View style={{ marginVertical: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Yonidagi bino
            </Text>
            <TextInput
              style={{
                marginTop: 8,
                padding: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                borderRadius: 6,
                backgroundColor: "#fff",
                fontSize: 15,
              }}
              placeholder="TATU-UF"
              placeholderTextColor="gray"
              value={landmark}
              onChangeText={setLandmark}
            />
          </View>
  
          <View style={{ marginVertical: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Pochta indeksi 
            </Text>
            <TextInput
              style={{
                marginTop: 8,
                padding: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                borderRadius: 6,
                backgroundColor: "#fff",
                fontSize: 15,
              }}
              placeholder="Urgench shahri: 220100"
              placeholderTextColor="gray"
              value={postalCode}
              onChangeText={setPostalCode}
            />
          </View>
  
          <Pressable
            onPress={handleSave}
            style={{
              marginTop: 20,
              padding: 10,
              borderWidth: 1,
              borderRadius: 7,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#9a42eb",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 ,color:"#ffff"}}>
              {addressId ? "Yangilash" : "Saqlash"
              }
              
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }