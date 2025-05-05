import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
  Image
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share } from 'react-native';


const ProductInfoScreen = () => {
  const route = useRoute();
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [addedToCart, setAddedToCart] = useState(false);
  const [liked, setLiked] = useState(false); // Liked holati
  const height = (width * 100) / 100;
  const dispatch = useDispatch();

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };

  // Mahsulot ID (noyob identifikator)
  const productId = route?.params?.id || route?.params?.item?.id || route?.params?.title;

  // Liked holatini AsyncStorage dan olish
  useEffect(() => {
    const loadLikeStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(`liked_${productId}`);
        if (value === 'true') {
          setLiked(true);
        }
      } catch (error) {
        console.log("Like statusni olishda xatolik:", error);
      }
    };
    loadLikeStatus();
  }, []);

  // Like tugmasini bosganda toggle qilish
  const toggleLike = async () => {
    try {
      const newStatus = !liked;
      setLiked(newStatus);
      await AsyncStorage.setItem(`liked_${productId}`, newStatus.toString());
    } catch (error) {
      console.log("Saqlashda xatolik:", error);
    }
  };

  const cart = useSelector((state) => state.cart.cart);
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Anor Marketdan eng sifatli va hamyonbop mahsulotlar:\n${route?.params?.carouselImages}\nMahsulot nomi: ${route?.params?.title}\nNarxi: ${route?.params?.price * 1200} so'm\nBatafsil: https://sizningwebsaytingiz.uz/mahsulot/${productId}`,
      });
  
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type of:', result.activityType);
        } else {
          console.log('Mahsulot ulashildi');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Ulash bekor qilindi');
      }
    } catch (error) {
      console.error('Ulashda xatolik:', error.message);
    }
  };
  

  return (
    <ScrollView style={{ marginTop: 42, flex: 1, backgroundColor: "white" }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: "#9a42eb", padding: 10, flexDirection: "row", alignItems: "center" }}>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 38,
            flex: 1,
          }}
        >
          <AntDesign style={{ paddingLeft: 10 }} name="search1" size={22} color="black" />
          <TextInput placeholder="Mahsulot qidirish" />
        </Pressable>
        <Feather name="mic" size={24} color="white" />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {route.params.carouselImages.map((item, index) => (
          <ImageBackground key={index} style={{ width, height, marginTop: "auto" }} source={{ uri: item }}>
            <View style={{
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#C60C30",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}>
                <Text style={{ color: "white", textAlign: "center", fontWeight: "600", fontSize: 12 }}>20% off</Text>
              </View>

              <Pressable
               onPress={handleShare} 
               style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#E0E0E0",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}>
                <MaterialCommunityIcons name="share-variant" size={24} color="black" />
              </Pressable>
            </View>

            <Pressable
              onPress={toggleLike}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#E0E0E0",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginTop: "auto",
                marginLeft: 20,
                marginBottom: 20,
              }}
            >
              <AntDesign
                name={liked ? "heart" : "hearto"}
                size={24}
                color={liked ? "red" : "green"}
              />
            </Pressable>
          </ImageBackground>
        ))}
      </ScrollView>

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>{route?.params?.title}</Text>
        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 6 }}>{route?.params?.price * 1200}</Text>
      </View>

      <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />

      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <Text style={{ fontSize: 15 }}>Rang: </Text>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>{route?.params?.color}</Text>
      </View>

      {route?.params?.size && (
        <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
          <Text style={{ fontSize: 15 }}>Xotira: </Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>{route?.params?.size}</Text>
        </View>
      )}

      <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5 }}>
          Jami : {route.params.price * 1200}
        </Text>
        <Text style={{ color: "#2b00ff" }}>
          Bepul yetkazib beramiz 3 soat 30 daqiqa ichida buyurtma bering
        </Text>

        <View style={{ flexDirection: "row", marginVertical: 5, alignItems: "center", gap: 5 }}>
          <Ionicons name="location" size={24} color="red" />
          <Text style={{ fontSize: 15, fontWeight: "500" }}>Xorazmga yetkazib berish - Urganch shahri</Text>
        </View>
      </View>

      <Pressable
        onPress={() => addItemToCart(route?.params?.item)}
        style={{
          backgroundColor: "#9a42eb",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        {addedToCart ? (
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Savatga qo'shildi</Text>
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Savatga qo'shish</Text>
        )}
      </Pressable>

      <Pressable
        style={{
          backgroundColor: "#9a42eb",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Hozir harid qilish</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({});
