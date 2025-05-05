import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert
} from "react-native";
import React, {
  useEffect,
  useState,
  useCon,
  useContext,
  useCallback,
} from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { UserContext, UserType } from "../../UserContext";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";

export default function AddAddresscreen() {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = useCallback(async () => {
    try {
      if (!userId) {
        console.log("userId hali yuklanmadi, so‘rov yuborilmaydi");
        return;
      }
      console.log("API so‘rovi yuborilmoqda, userId:", userId);
      const response = await axios.get(
        `http://192.168.100.213:8000/addresses/${userId}`
      );
      console.log("API to‘liq javobi:", response.data);
      const addresses = Array.isArray(response.data?.addresses)
        ? response.data.addresses
        : Array.isArray(response.data)
        ? response.data
        : [];
      console.log("Olingan addresses:", addresses);
      setAddresses(addresses);
    } catch (error) {
      console.log(
        "Manzillarni olishda xato:",
        error.message,
        error.response?.data
      );
      Alert.alert("Xatolik", "Manzillarni yuklashda xato yuz berdi");
      setAddresses([]);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );
  console.log("addresses", addresses);

  return (
    <View
      style={{ marginTop: 42, flex: 1, backgroundColor: "white" }}
      
    >
      <View
        style={{
          backgroundColor: "#9a42eb",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
      
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 39,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="search1"
            size={22}
            color="black"
          />
          <TextInput placeholder="Mahsulot qidirish" />
        </Pressable>

        <Feather name="mic" size={24} color="white" />
        </View>
       <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>
          Sizning manzilingiz?
        </Text>

        <Pressable
          onPress={() => navigation.navigate("Add")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            paddingVertical: 7,
            paddingHorizontal: 5,
          }}
        >
          <Text>Yangi yetkazib berish manzilini qo‘shish</Text>

          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </Pressable>

        <Pressable>
          {addresses?.map((item, index) => (
            <Pressable
              key={item._id || `address-${index}`}
              style={{
                borderWidth: 1,
                borderColor: "#D0D0D0",
                padding: 10,
                flexDirection: "column",
                gap: 6,
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  {item?.region}
                </Text>
                <Entypo name="location-pin" size={24} color="red" />
              </View>
              <Text
                style={{
                  color: "#181818",
                  fontSize: 15,
                }}
              >
                {item?.city}
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  color: "#181818",
                }}
              >
                {item?.houseNo},{item?.landmark}
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  color: "#181818",
                }}
              >
                {item?.street}
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  color: "#181818",
                }}
              >
                Telefon Number : {item?.mobileNo}
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  color: "#181818",
                }}
              >
                Pochta indeksi : {item?.postalCode}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 8,
                }}
              >
                
                <Pressable
                  onPress={() => navigation.navigate("Add", { item })}
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 6,
                    borderWidth: 0.99,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>Tahrirlash 🖍️</Text>
                </Pressable>

                <Pressable
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 6,
                    borderWidth: 0.99,
                    borderColor: "#D0D0D0",
                  }}
                  onPress={() => {
                    Alert.alert(
                      "O‘chirishni tasdiqlang",
                      "Bu manzilni o‘chirishni xohlaysizmi?",
                      [
                        {
                          text: "Yo‘q",
                          style: "cancel",
                        },
                        {
                          text: "Ha",
                          onPress: async () => {
                            try {
                              // Serverdan manzilni o‘chirish
                              await axios.delete(
                                `http://192.168.165.10:8000/addresses/${userId}/${item._id}`
                              );
                              // Ro‘yxatni yangilash
                              setAddresses(
                                addresses.filter(
                                  (addr) => addr._id !== item._id
                                )
                              );
                              Alert.alert("Muvaffaqiyat", "Manzil o‘chirildi");
                            } catch (error) {
                              console.log(
                                "Manzilni o‘chirishda xato:",
                                error.message
                              );
                              Alert.alert(
                                "Xatolik",
                                "Manzilni o‘chirishda xato yuz berdi"
                              );
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text>O'chirish 🗑</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </Pressable>
      </View>
     
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
