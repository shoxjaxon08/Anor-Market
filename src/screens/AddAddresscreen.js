import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Image
} from "react-native";
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { UserContext, UserType } from "../../UserContext";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";



export default function AddAddresscreen() {
  const route = useRoute();

  useEffect(() => {
    if (route.params?.openModal ===true) {
      navigation.navigate('Main', { openModal: true }); // Modal ochish uchun Home'ga o'tish
    }
  }, [route.params?.openModal, navigation]);

const openModalAndNavigate = () => {
  console.log('Navigating to Main with params:', { openModal: true });
  navigation.navigate("Main", { openModal: true });
};

  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
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
        `http://192.168.70.10:8000/addresses/${userId}`
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
      <View style={{ height: 53, backgroundColor: "#9a42eb", justifyContent: 'center' }}>
  <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
    
      
  <Pressable onPress={openModalAndNavigate}>
        <AntDesign name="left" size={24} color="white" />

        </Pressable>
       <Text  style={{ fontSize:25,color:"white",fontWeight:'500',marginLeft:65}}>Anor Market   </Text>
       <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/128/5721/5721996.png' }}
          style={{ width: 40, height: 40 }}
        />
   
     </View>
     
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
                                `http://192.168.70.10:8000/addresses/${userId}/${item._id}`
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
