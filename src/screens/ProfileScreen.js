import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// issor@1.0.0
import axios from 'axios';
import { UserType } from '../../UserContext'; // Sizning UserType kontekstingiz

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userId } = useContext(UserType);
  const [userData, setUserData] = useState({ name: '', email: '' });

  // Foydalanuvchi ma'lumotlarini olish
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token || !userId) {
          Alert.alert('Xatolik', 'Foydalanuvchi ma\'lumotlari topilmadi');
          navigation.navigate('Login');
          return;
        }

        // Serverdan foydalanuvchi ma'lumotlarini olish
        const response = await axios.get(`http://192.168.165.10:8000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Foydalanuvchi ma\'lumotlarini olishda xatolik:', error);
        Alert.alert('Xatolik', 'Ma\'lumotlarni yuklashda xato yuz berdi');
        navigation.navigate('Login');
      }
    };
    fetchUserData();
  }, [userId, navigation]);

  // Logout funksiyasi
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken'); // Tokenni o‘chirish
      Alert.alert('Muvaffaqiyat', 'Siz tizimdan chiqdingiz');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Login ekraniga qaytish
      });
    } catch (error) {
      console.error('Logout xatosi:', error);
      Alert.alert('Xatolik', 'Chiqishda xato yuz berdi');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Foydalanuvchi Profili</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Ism:</Text>
        <Text style={styles.info}>{userData.name || 'Yuklanmoqda...'}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{userData.email || 'Yuklanmoqda...'}</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Tizimdan chiqish</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 100,
  },
  info: {
    fontSize: 18,
    flex: 1,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 7,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;