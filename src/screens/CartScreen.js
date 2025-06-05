import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,Image
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useDispatch, useSelector} from 'react-redux' 
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { incrementQuantity,decrementQuantity,removeFromCart } from "../redux/CartReducer";


export default function CartScreen() {
  const navigation = useNavigation();
  const cart = useSelector((state) => (state.cart.cart))
  const total = cart?.map((item) => item?.price * item?.quantity)
  .reduce((curr,prev) => curr + prev,0) || 0;

  const dispatch = useDispatch();

  const increment = (item) => {
    dispatch(incrementQuantity(item));
  }
  const decrement = (item) => {
    dispatch(decrementQuantity(item));
  }
  const deleteItem = (item) => {
    dispatch(removeFromCart(item))
  }

const translateTitle = (title) => {
  const translations = {
    "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops":
      "Fjallraven - Foldsack No. 1 Ryukzak, 15 dyuymli noutbuklarga mos keladi",
    "Mens Casual Premium Slim Fit T-Shirts":
      "Erkaklar uchun oddiy premium slim fit futbolkalar",
    "Mens Cotton Jacket": "Erkaklar uchun paxta kurtka",
    "Mens Casual Slim Fit": "Erkaklar uchun oddiy slim fit kiyim",
    "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet":
      "John Hardy ayollar uchun Legends Naga oltin va kumush ajdaho bilaguzuk",
    "Solid Gold Petite Micropave": "Qattiq oltin petite micropave",
    "White Gold Plated Princess": "Oltin bilan qoplangan oq malika uzuk",
    "Pierced Owl Rose Gold Plated Stainless Steel Double":
      "Pierced Owl pushti oltin bilan qoplangan zanglamaydigan po‘latdan ikki qavatli",
    "WD 2TB Elements Portable External Hard Drive - USB 3.0":
      "WD 2TB Elements tashqi qattiq disk - USB 3.0",
    "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s":
      "SanDisk SSD PLUS 1TB ichki SSD - SATA III 6 Gb/s",
    "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5":
      "Silicon Power 256GB SSD 3D NAND A55 SLC keshli ishlashni oshiruvchi SATA III 2.5",
    "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive":
      "WD 4TB o‘yin diski PlayStation 4 uchun mos tashqi qattiq disk",
    "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin":
      "Acer SB220Q bi 21.5 dyuym Full HD (1920 x 1080) IPS ultra yupqa monitor",
    "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED":
      "Samsung 49 dyuym CHG90 144Hz egri o‘yin monitori (LC49HG90DMNXZA) – Super ultrawide ekran QLED",
    "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats":
      "BIYLACLESEN ayollar uchun 3-in-1 qor kurtkasi qishki palto",
    "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket":
      "Lock and Love ayollar uchun olinadigan kapushonli sun’iy charm moto biker kurtka",
    "Rain Jacket Women Windbreaker Striped Climbing Raincoats":
      "Ayollar uchun yomg‘ir kurtkasi shamol o‘tkazmaydigan chiziqli alpinizm yomg‘ir kiyimi",
    "MBJ Women's Solid Short Sleeve Boat Neck V":
      "MBJ ayollar uchun qisqa yengli qayiqli bo‘yinli V ko‘ylak",
    "Opna Women's Short Sleeve Moisture":
      "Opna ayollar uchun qisqa yengli namlik o‘tkazuvchi futbolka",
    "DANVOUY Womens T Shirt Casual Cotton Short":
      "DANVOUY ayollar uchun oddiy paxta qisqa futbolka",
    // HomeScreen dan qo'shilgan mahsulotlar uchun qo'shimcha tarjimalar
    "OnePlus Nord CE 3 Lite 5G (Pastel Lime, 8GB RAM, 128GB)":
      "OnePlus Nord CE 3 Lite 5G (Yashil, 8GB RAM, 128GB)",
    "Samsung Galaxy S20 FE 5G (Moviy, 8GB RAM, 128GB)":
      "Samsung Galaxy S20 FE 5G (Moviy, 8GB RAM, 128GB)",
    "Samsung Galaxy M14 5G (Kumushrang, 4GB RAM, 128GB)":
      "Samsung Galaxy M14 5G (Kumushrang, 4GB RAM, 128GB)",
    "realme narzo N55 (Koʻk, 4GB RAM, 64GB)":
      "realme narzo N55 (Koʻk, 4GB RAM, 64GB)",
    "Oppo Enco Air3 Pro True Wireless in Ear Earbuds":
      "Oppo Enco Air3 Pro simsiz quloqchinlar",
    "Fastrack Limitless FS1 Pro": "Fastrack Limitless FS1 Pro aqlli soat",
    "Aishwariya simsiz quloqchinlar": "Aishwariya simsiz quloqchinlar",
    "Fastrack Limitless FS1 Pro (Koʻk)": "Fastrack Limitless FS1 Pro (Koʻk)",
  };
  return translations[title] || title;
};

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
        <TextInput style={{ color:'gray'}} placeholder="Mahsulot qidirish" />
      </Pressable>

      <Feather name="mic" size={24} color="white" />
    </View>
    

 <ScrollView showsVerticalScrollIndicator={false}>
    <View  style={{
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
      }}>
      <Text  style={{
        fontSize:17,
        fontWeight:550
      }}>Jami summa : </Text>
    
      <Text style={{
          fontSize:17,
          fontWeight:'bold'
        }}>{total * 1200}</Text>

        
    </View>
    {/* <Text style={{ marginHorizontal: 10 }}>EMI tafsilotlari mavjud</Text> */}
    <Text style={{
        fontSize:17,
        fontWeight:550,
        marginHorizontal:12
      }}>Mahsulotlar soni {cart.length} ta  </Text>

<Pressable
onPress={() => navigation.navigate("Confirm")}
style={{

  backgroundColor: "#9400D3",
  padding: 10,
  borderRadius: 5,
  justifyContent: "center",
  alignItems: "center",
  marginHorizontal: 10,
  marginTop: 10,
}}
>
<Text 
onPress={() => navigation.navigate("Confirm")}
style={{
  color:'#ffff',
  fontWeight:'500',
  fontSize:17
}}>Rasmiylashtirish</Text>
</Pressable>

<Text
style={{
  height: 1,
  borderColor: "#D0D0D0",
  borderWidth: 1,
  marginTop: 16,
}}
/>

<View style={{ marginHorizontal: 10 }}>
{cart?.map((item, index) => (
  <View
    style={{
      backgroundColor: "white",
      marginVertical: 10,
      borderBottomColor: "#F0F0F0",
      borderWidth: 2,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderRightWidth: 0,
    }}
    key={index}
  >
    <Pressable
      style={{
        marginVertical: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
                  {/* item?.image o'rniga item?.carouselImages[0] ishlatamiz */}
                  {item?.carouselImages && item.carouselImages.length > 0 ? (
                    <Image
                      style={{ width: 140, height: 140, resizeMode: "contain" }}
                      source={{ uri: item.carouselImages[0] }} // Birinchi rasmni ko'rsatish
                    />
                  ) : (
                    <View>
                    <Image
                      style={{ width: 140, height: 140, resizeMode: "contain" }}
                      source={{ uri: item?.image }}
                    />
                  </View>
                  )}
                </View>
     

      <View>
        <Text numberOfLines={8} style={{ width: 150, marginTop: 10 }}>
          {item?.title }
        </Text>
        <Text
          style={{ fontSize: 20, fontWeight: "bold", marginTop: 3 }}
        >
          {item?.price * 1200}
        </Text>
        <Image
          style={{ width: 30, height: 30, resizeMode: "contain" }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
          }}
        />
        <Text style={{ color: "green" ,marginTop:6}}>Sotuvda mavjud</Text>
       
      </View>
    </Pressable>

  <Pressable  
      style={{
          flexDirection:'row',
          alignItems:'center',
          marginTop:10,
          marginBottom:10,
          alignItems:'center',
          gap:8
          
        }}>
    <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 7,
        }}
      >
    <Pressable
      style={{
       padding:7,
       borderRadius:7
      }}
    >
        </Pressable>
      {item?.quantity > 1 ? (
        <Pressable  onPress = {() => decrement(item)}
        style = {{
          backgroundColor:'white',
          paddingVertical:8          
        }}
        >
          <FontAwesome name="minus-circle" size={36} color="red" />

        </Pressable>

      ) : (
        <Pressable
        onPress={() => deleteItem(item)} 
        style = {{
          backgroundColor:'white',
          paddingVertical:8          
        }}>
          <AntDesign name="delete" size={32} color="red" />

        </Pressable>

      )
    
    }
        
       <Pressable>
       <Text style={{
       backgroundColor:'#ffff',
       paddingVertical:5,
       paddingHorizontal:18,
       fontWeight:'400',
       fontSize:15
       
      }} >{item?.quantity}</Text>
        </Pressable>
      <Pressable>

      </Pressable>

  
      <Pressable onPress={() => increment(item)}
      style = {{
        backgroundColor:'white',
        paddingVertical:8          
      }}>
      <AntDesign name="pluscircle" size={30} color="green" />

      </Pressable>
        </View>
          <Pressable 
           onPress={() => deleteItem(item)} 
    
          style = {{
                  backgroundColor:'#f4fafb',
                  paddingVertical:8,
                  borderWidth:0.8,
                  borderColor:'#C0C0C0',
                  borderRadius:4,
                  paddingHorizontal:6,
                  paddingVertical:10,
                  marginLeft:4,   

              }}>
              <Text
              style = {{
                  color:'red',
                  fontWeight:'520'}}
                >O'chirish</Text>

               <Pressable>
                  
                </Pressable>
          </Pressable>
        </Pressable>
  </View>
))}
  </View>
   </ScrollView>
  </View>
)
}

const styles = StyleSheet.create({})