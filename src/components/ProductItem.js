import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/CartReducer';

export default function ProductItem({ item }) {
   const [addedToCart,setAddedToCart] = useState(false);
   const dispatch = useDispatch();
   const addItemToCart = (item) => {
      setAddedToCart(true);
      dispatch(addToCart(item));
      setTimeout(() => {
        setAddedToCart(false);
      },6000);
   }
   
  return (
    <Pressable style={{ marginHorizontal: 20, marginVertical: 28 }}>
      <Image style={{ height: 150, width: 150, resizeMode: 'contain' }} source={{ uri: item?.image }} />
      <Text numberOfLines={1} style={{ width: 150, marginTop: 10 }}>{item?.title}</Text>

      <View style = {{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
      <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item?.price * 1200}</Text>
      <Text style={{ color: "#FFC70C", fontWeight: 'bold' }}>{item?.rating?.rate} reyting</Text>
      </View>

      <Pressable
      onPress={() => addItemToCart(item)}
      style={{
        backgroundColor: "#9a42eb",
        padding: 10,
        marginTop: 10,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18
      }} >

      {
        addedToCart ? (
          <View>
             <Text style={{ color: "#ffff", fontWeight: '500',fontSize:14 }}>Savatga qo'shildi</Text>
          </View>
         
        ):(
          <Text  style={{ color: "#ffff", fontWeight: '500' }}>Savatga</Text>
        )
      }
     

      </Pressable>

    </Pressable>

  )
}

const styles = StyleSheet.create({})

