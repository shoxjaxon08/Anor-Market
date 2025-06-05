import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/CartReducer';
import { useNavigation } from '@react-navigation/native'; // Navigatsiya uchun
import { AntDesign } from '@expo/vector-icons'; // Savatcha ikonasi uchun

export default function ProductItem({ item }) {
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation(); // Navigatsiyani ishlatish uchun

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 7000);
  };

  const goToCart = () => {
    navigation.navigate('Cart'); 
  };

  return (
    <Pressable style={{ marginHorizontal: 20, marginVertical: 28 }}>
      <Image style={{ height: 150, width: 150, resizeMode: 'contain' }} source={{ uri: item?.image }} />
      <Text numberOfLines={1} style={{ width: 150, marginTop: 10 }}>{item?.title}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item?.price * 1200}</Text>
        <Text style={{ color: "#FFC70C", fontWeight: 'bold' }}>{item?.rating?.rate} reyting</Text>
      </View>

      <Pressable
        onPress={() => (addedToCart ? goToCart() : addItemToCart(item))} 
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
    </Pressable>
  );
}

const styles = StyleSheet.create({});