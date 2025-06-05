import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserType } from "../../UserContext";
import axios from "axios";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { cleanCart } from "../redux/CartReducer";

export default function ConfirmationScreen() {
  const steps = [
    { title: "Manzil", context: "Manzil shakli" },
    { title: "Yetkazib berish", context: "Yetkazib berish imkoniyatlari" },
    { title: "To'lov qilish", context: "To'lov tafsilotlar" },
    { title: "Buyurtma berish", context: "Buyurtma fikri" },
  ];
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddres] = useState("");
  const [option, setOption] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const { userId } = useContext(UserType);
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState("");
  const cart = useSelector((state) => state.cart.cart);
  const total =
    cart?.map((item) => item?.price * item?.quantity).reduce((curr, prev) => curr + prev, 0) || 0;
  const totalPrice = total * 1200; // Umumiy summa so‘mda

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const fetchAddresses = useCallback(async () => {
    try {
      if (!userId) {
        console.log("userId hali yuklanmadi, so‘rov yuborilmaydi");
        return;
      }
      const response = await axios.get(`http://192.168.70.10:8000/addresses/${userId}`);
      const addresses = Array.isArray(response.data?.addresses)
        ? response.data.addresses
        : Array.isArray(response.data)
        ? response.data
        : [];
      setAddresses(addresses);
    } catch (error) {
      console.log("Manzillarni olishda xato:", error.message);
      Alert.alert("Xatolik", "Manzillarni yuklashda xato yuz berdi");
      setAddresses([]);
    }
  }, [userId]);

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: totalPrice,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
      };

      if (selectedOption === "Karta") {
        // Click to‘lov sahifasiga yo‘naltirish (test uchun umumiy URL ishlatiladi)
        const clickPaymentUrl = `https://my.click.uz/services/pay?amount=${totalPrice}&order_id=order_${Date.now()}`;
        Linking.openURL(clickPaymentUrl).catch((err) =>
          Alert.alert("Xatolik", "To‘lov sahifasini ochishda muammo yuz berdi")
        );
      } else {
        const response = await axios.post("http://192.168.70.10:8000/orders", orderData);
        if (response.status >= 200 && response.status < 300) {
          dispatch(cleanCart());
          navigation.navigate("Order");
          Alert.alert("Muvaffaqiyat", "Buyurtma muvaffaqiyatli yaratildi");
          console.log("Buyurtma muvaffaqiyatli yaratildi", response.data.order);
        } else {
          Alert.alert("Xatolik", "Buyurtma yaratishda muammo yuz berdi");
          console.log("Xatolik buyurtma yaratishda:", response.data);
        }
      }
    } catch (error) {
      console.log("Xatolik:", error);
      Alert.alert("Xatolik", "Internet bilan bog‘lanishda muammo bor");
    }
  };

  const handleContinue = () => {
    if (currentStep === 2 && !selectedOption) {
      Alert.alert("Ogohlantirish", "Iltimos, to‘lov usulini tanlang");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  return (
    <ScrollView style={{ margin: 20 }}>
      <View style={{ paddingHorizontal: 15, paddingTop: 40 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            justifyContent: "space-between",
          }}
        >
          {steps.map((step, index) => (
            <View key={index} style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: index < currentStep ? "green" : "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#ffff" }}>
                  {index < currentStep ? "✓" : index + 1}
                </Text>
              </View>
              <Text style={{ textAlign: "center", marginTop: 8, fontSize: 13 }}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {currentStep === 0 && (
        <View style={{ marginHorizontal: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Yetkazib berish manzilini tanlang
          </Text>

          {addresses.map((item, index) => (
            <Pressable
              key={item._id || index}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                {selectedAddress && selectedAddress._id === item?._id ? (
                  <FontAwesome5 name="dot-circle" size={21} color="#9008ff" />
                ) : (
                  <Entypo
                    onPress={() => setSelectedAddres(item)}
                    name="circle"
                    size={20}
                    color="gray"
                  />
                )}

                <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 8 }}>
                  {item?.region}
                </Text>
                <Entypo
                  name="location-pin"
                  size={21}
                  color="red"
                  style={{ marginLeft: 4 }}
                />
              </View>

              <Text style={{ fontSize: 15, color: "#181818" }}>{item?.city}</Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                {item?.houseNo}, {item?.landmark}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>{item?.street}</Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                Telefon: {item?.mobileNo}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                Pochta indeksi: {item?.postalCode}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                  gap: 10,
                }}
              >
                <Pressable
                  onPress={() => navigation.navigate("Add", { item })}
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>Tahrirlash 🖍️</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    Alert.alert(
                      "O‘chirishni tasdiqlang",
                      "Bu manzilni o‘chirishni xohlaysizmi?",
                      [
                        { text: "Yo‘q", style: "cancel" },
                        {
                          text: "Ha",
                          onPress: async () => {
                            try {
                              await axios.delete(
                                `http://192.168.70.10:8000/addresses/${userId}/${item._id}`
                              );
                              setAddresses(
                                addresses.filter((addr) => addr._id !== item._id)
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
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>O‘chirish 🗑</Text>
                </Pressable>
              </View>

              {selectedAddress && selectedAddress._id === item?._id && (
                <Pressable
                  onPress={() => setCurrentStep(1)}
                  style={{
                    backgroundColor: "#7008f8",
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                    borderRadius: 11,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 16,
                  }}
                >
                  <Text
                    style={{
                      color: "#ffff",
                      textAlign: "center",
                      fontWeight: 500,
                      padding: 7,
                    }}
                  >
                    Ushbu manzilga yetkazib berish
                  </Text>
                </Pressable>
              )}
            </Pressable>
          ))}
        </View>
      )}

      {currentStep === 1 && (
        <View style={{ marginHorizontal: 7 }}>
          <Text style={{ fontSize: 19, fontWeight: "bold" }}>
            Variantlaringizni tanlang
          </Text>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              padding: 11,
              gap: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 16,
            }}
          >
            {option ? (
              <FontAwesome5 name="dot-circle" size={21} color="#9008ff" />
            ) : (
              <Entypo
                onPress={() => setOption(!option)}
                name="circle"
                size={21}
                color="gray"
              />
            )}

            <Text style={{ flex: 1 }}>
              <Text
                style={{ color: "green", fontWeight: "bold", marginHorizontal: 0.4 }}
              >
                Ertaga soat 22:00 gacha sotib oling
              </Text>
              <Text>– Prime a’zoligingiz evaziga yetkazib berish bepul</Text>
            </Text>
          </View>
          <Pressable
            onPress={() => setCurrentStep(2)}
            style={{
              backgroundColor: "#9008ff",
              alignItems: "center",
              marginTop: 19,
              justifyContent: "center",
              padding: 11,
              borderRadius: 21,
            }}
          >
            <Text style={{ color: "#ffff", fontSize: 15, fontWeight: 500 }}>
              Davom etish
            </Text>
          </Pressable>
        </View>
      )}

      {currentStep === 2 && (
        <View style={{ marginHorizontal: 7 }}>
          <Text style={{ fontWeight: "bold", fontSize: 21 }}>
            To'lov usulingizni tanlang
          </Text>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              padding: 11,
              gap: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 16,
            }}
          >
            {selectedOption === "Naqd pul" ? (
              <FontAwesome5 name="dot-circle" size={21} color="#9008ff" />
            ) : (
              <Entypo
                onPress={() => setSelectedOption("Naqd pul")}
                name="circle"
                size={21}
                color="gray"
              />
            )}
            <Text>Naqd pul</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              padding: 11,
              gap: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 16,
            }}
          >
            {selectedOption === "Karta" ? (
              <FontAwesome5 name="dot-circle" size={21} color="#9008ff" />
            ) : (
              <Entypo
                onPress={() => setSelectedOption("Karta")}
                name="circle"
                size={21}
                color="gray"
              />
            )}
            <Text>Karta orqali onlayn</Text>
          </View>
          <Pressable
            onPress={() => {
              if (!selectedOption) {
                Alert.alert("Ogohlantirish", "Iltimos, to‘lov usulini tanlang");
                return;
              }
              setCurrentStep(3);
            }}
            style={{
              backgroundColor: "#9008ff",
              alignItems: "center",
              marginTop: 19,
              justifyContent: "center",
              padding: 11,
              borderRadius: 21,
            }}
          >
            <Text style={{ color: "#ffff", fontSize: 15, fontWeight: 500 }}>
              Davom etish
            </Text>
          </Pressable>
        </View>
      )}

      {currentStep === 3 && (
        <View style={{ marginHorizontal: 7 }}>
          <Text style={{ fontWeight: "bold", fontSize: 21 }}>
            Hozir buyurtma bering
          </Text>
          <View>
            <View
              style={{
                backgroundColor: "white",
                padding: 11,
                gap: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 16,
              }}
            >
              <View>
                <Text style={{ fontSize: 16, fontWeight: "400" }}>
                  {selectedAddress?.region}ga yetkazib berish
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 7,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                  Buyumlar miqdori{" "}
                </Text>
                <Text style={{ fontSize: 16, color: "gray" }}>{totalPrice}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 7,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                  Yetkazib berish miqdori{" "}
                </Text>
                <Text>0</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 7,
                }}
              >
                <Text style={{ fontSize: 19, fontWeight: "600" }}>Jami summa</Text>
                <Text
                  style={{ fontSize: 17, fontWeight: "500", color: "#C60C30" }}
                >
                  {totalPrice} so'm
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: 11,
                gap: 8,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 16,
              }}
            >
              <Text style={{ color: "gray", fontSize: 15 }}>Bilan to'lash</Text>
              <Text style={{ fontSize: 15, fontWeight: "500" }}>
                {selectedOption === "Karta"
                  ? "Yetkazib berishda karta orqali to'lash"
                  : "Yetkazib berishda naqd puldan foydalanish"}
              </Text>
            </View>

            <Pressable
              onPress={handlePlaceOrder}
              style={{
                backgroundColor: "#9008ff",
                alignItems: "center",
                marginTop: 20,
                justifyContent: "center",
                padding: 11,
                borderRadius: 21,
              }}
            >
              <Text style={{ color: "#ffff", fontSize: 15, fontWeight: 500 }}>
                Buyurtma berish
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});