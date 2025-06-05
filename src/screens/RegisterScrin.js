import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView,Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TextInput } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Pressable } from 'react-native';
import { white } from 'react-native-paper';


import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';

export default function RegisterScrin() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const handleRegister = () => {
   
    
    if (password.length < 8) {
      Alert.alert("Parol xatolik", "Parol kamida 8 ta belgidan iborat bo‘lishi kerak");
      return;
    }
 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Email xatolik", "Iltimos, to‘g‘ri email kiriting");
      return;
    }
  
    const user = {
      name,
      email,
      password,
    };
  
    axios.post('http://192.168.70.10:8000/register', user)
     // uy -> 192.168.100.213  phone -> 192.168.248.10
      .then((response) => {
        console.log(response.data);
        Alert.alert(
          "Ro‘yxatdan o‘tdingiz",
          "Siz ro‘yxatdan muvaffaqiyatli o‘tdingiz, tabriklaymiz"
        );
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message ;
        console.log("Xatolik:", errMsg);
        // 3. Email allaqachon mavjud degan xabarni ko‘rsatish
        if (errMsg.includes("Email") && errMsg.includes("yaratilgan")) {
          Alert.alert("Email xatolik", "Bu email allaqachon mavjud. Iltimos, boshqa email kiriting");
        } else {
          Alert.alert("Xatolik", errMsg);
        }
  
      });
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', alignItems: "center" }}>
      <View>
        <Image style={{ width: 190, height: 200, marginTop: 20 }} source={require('../../assets/AnorMarket.png')} />
      </View>

      <KeyboardAvoidingView behavior="padding">
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 0.00001, color: '#041E42' }}>Ro‘yxatdan o‘tish</Text>
        </View> 

        <View style={{ marginTop: 18 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 30,
              backgroundColor: '#D0D0D0',
              paddingVertical: 1,
              borderRadius: 8,
            }}
          >
            <Ionicons style={{ marginLeft: 10 }} name="person-sharp" size={24} color="gray" />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)} 
              style={{
                backgroundColor: '#D0D0D0', 
                width: 380,
                flex: 1,
                color: 'gray',
                padding: 0.5,
                fontSize: name ? 16 : 16

              }}
              placeholder="Ismingizni kiriting"

              theme={{
                colors: {
                  primary: 'gray',

                },
              }}

            />
          </View>
        </View>



        <View >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 30,
              backgroundColor: '#D0D0D0',
              paddingVertical: 1,
              borderRadius: 8,
            }}
          >

            <MaterialIcons style={{ marginLeft: 10 }} name="email" size={24} color="gray" />
            <TextInput
              value={email} // Bu yerda email qiymatini bog'ladik
              onChangeText={(text) => setEmail(text)} // Foydalanuvchi kiritgan matnni o'zgartiris
              style={{
                backgroundColor: '#D0D0D0', // Orqa rangni o'zgartirish
                width: 380,
                flex: 1,
                color: 'gray',
                padding: 0.5,
                fontSize: email ? 16 : 16

              }}
              placeholder="Emailingizni kiriting"

              theme={{
                colors: {
                  primary: 'gray',

                },
              }}

            />
          </View>
        </View>

        <View style={{ marginTop: 2 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 30,
              backgroundColor: '#D0D0D0',
              paddingVertical: 5,
              borderRadius: 8,
              width: 360,
              paddingRight: 10,
            }}
          >
            <AntDesign style={{ marginLeft: 10 }} name="lock1" size={24} color="gray" />
            <TextInput
              style={{
                backgroundColor: '#D0D0D0',
                width: 260,
                flex: 1,
                color: 'gray',
                padding: 0.5,
                fontSize: password ? 16 : 16
              }}
              placeholder="Parolingizni kiriting"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!showPassword}
              theme={{
                colors: {
                  primary: 'gray',
                },
              }}
            />

            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="gray"
              onPress={() => setShowPassword(!showPassword)}
              style={{ marginLeft: 10 }}
            />

          </View>
        </View>

        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 12,
          width: 360
        }}>
          <Text>Meni tizimda saqlab qo‘yish</Text>
          <Text style={{ color: "#007FFF", fontWeight: '500' }}>
            Parolni unutdingizmi?
          </Text>
        </View>
        <View style={{ marginTop: 80 }} />

        <Pressable
        onPress = {handleRegister}
          style={{
            width: 200,
            backgroundColor: '#af10fe',
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: 'auto',
            padding: 15
          }}>
          <Text style={{ textAlign: 'center', color: "#ffff", fontSize: 16, fontWeight: 'bold' }}>Ro‘yxatdan o‘tish</Text>
        </Pressable>


        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>Allaqachon hisobingiz bormi? Tizimga kiring</Text>
        </Pressable>



      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})