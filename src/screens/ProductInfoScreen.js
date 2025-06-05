import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
  Image,
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
  const [liked, setLiked] = useState(false);
  const height = (width * 100) / 100;
  const dispatch = useDispatch();

  const addItemToCart = (item) => {
    // To'liq item ni log qilamiz
    console.log("Item before filtering:", JSON.stringify(item, null, 2));

    // Faqat kerakli serializable maydonlarni olamiz
    const cartItem = {
      id: item?.id,
      title: item?.title,
      price: item?.price,
      color: item?.color,
      carouselImages: item?.carouselImages,
      // Boshqa kerakli maydonlarni qo'shish mumkin
    };

    // Serializable bo'lmagan qiymatlarni aniqlab o'chirish
    Object.keys(cartItem).forEach((key) => {
      if (typeof cartItem[key] === 'function' || (cartItem[key] instanceof Object && !Array.isArray(cartItem[key]) && Object.keys(cartItem[key]).length === 0)) {
        delete cartItem[key];
      } else if (cartItem[key] instanceof Object && Object.keys(cartItem[key]).includes('replace')) {
        delete cartItem[key]; // navigation kabi ob'ektlarni o'chirish
      }
    });

    // Filtrlangan ob'ektni log qilamiz
    console.log("Filtered cartItem:", JSON.stringify(cartItem, null, 2));

    setAddedToCart(true);
    dispatch(addToCart(cartItem)); // Faqat serializable ob'ektni Redux'ga uzatamiz
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };

  const productId = route?.params?.id || route?.params?.item?.id || route?.params?.title;

  const goToCart = () => {
    navigation.navigate("Main", {
      screen: "Cart"
    });
    
  };

  useEffect(() => {
    console.log("Route params:", JSON.stringify(route?.params, null, 2));
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

  useEffect(() => {
    if (route?.params?.item) {
      console.log("Full Item:", JSON.stringify(route?.params?.item, null, 2));
    } else {
      console.log("item mavjud emas");
    }
  }, [route?.params]);

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
    <ScrollView
      style={{
        marginTop: 42,
        flex: 1,
        backgroundColor: "white",
      }}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        style={{
          marginTop: 8,
          paddingLeft: 4,
        }}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={24} color="black" />
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {route.params.carouselImages.map((item, index) => (
          <ImageBackground
            key={index}
            style={{
              width,
              height,
              marginTop: "auto",
            }}
            source={{ uri: item }}
          >
            <View
              style={{
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#C60C30",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: 12,
                  }}
                >
                  20% off
                </Text>
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
                }}
              >
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
              <AntDesign name={liked ? "heart" : "hearto"} size={24} color={liked ? "red" : "green"} />
            </Pressable>
          </ImageBackground>
        ))}
      </ScrollView>

      <View
        style={{
          padding: 10,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            color: "#000",
          }}
        >
          {route?.params?.title}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginTop: 6,
            color: "#000",
          }}
        >
          {route?.params?.price * 1200}
        </Text>
      </View>

      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 1,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: "#000",
          }}
        >
          Rang:{" "}
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            color: "#000",
          }}
        >
          {route?.params?.color}
        </Text>
      </View>

      {route?.params?.size && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: "#000",
            }}
          >
            Xotira:{" "}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#000",
            }}
          >
            {route?.params?.size}
          </Text>
        </View>
      )}

      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 1,
        }}
      />

      <View
        style={{
          padding: 10,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            marginVertical: 5,
            color: "#000",
          }}
        >
          Jami: {route.params.price * 1200}
        </Text>
        <Text
          style={{
            color: "#2b00ff",
            fontSize: 14,
          }}
        >
          Bepul yetkazib beramiz 3 soat 30 daqiqa ichida buyurtma bering
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 5,
            alignItems: "center",
            gap: 5,
          }}
        >
          <Ionicons name="location" size={24} color="red" />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: "#000",
            }}
          >
            Xorazmga yetkazib berish - Urganch shahri
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => (addedToCart ? goToCart() : addItemToCart(route?.params?.item))}
        style={{
          backgroundColor: addedToCart ? 'green' : '#9a42eb',
          padding: 10,
          marginTop: 10,
          marginHorizontal: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 18,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {addedToCart ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AntDesign name="shoppingcart" size={20} color="#fff" style={{ marginRight: 5 }} />
            <Text style={{ color: "#fff", fontWeight: '500', fontSize: 16 }}>
              O'tish
            </Text>
          </View>
        ) : (
          <Text style={{ color: "#fff", fontWeight: '500', fontSize: 16 }}>
            Savatga
          </Text>
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
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Hozir harid qilish
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProductInfoScreen;