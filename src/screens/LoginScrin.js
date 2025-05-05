import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TextInput } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScrin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                
                if (token) {
                    navigation.replace("Main");
                }
            } catch (error) {
                console.log("error Loginstatusdan", error);
            }
        };
        checkLoginStatus();
    }, []);

    const handleLogin = () => {
        console.log("Email:", email);
        console.log("Password:", password);

        // Email formatini tekshirish
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Iltimos, to‘g‘ri email manzilini kiriting (masalan, example@gmail.com)");
            return;
        }

        const user = {
            email: email.trim().toLowerCase(),
            password: password,
        };

        axios.post("http://192.168.100.213:8000/login", user) 
         // uy -> 192.168.100.213  phone -> 192.168.248.10
            .then((response) => {
                console.log(response);
                const token = response.data.token;
                AsyncStorage.setItem("authToken", token);
                navigation.replace("Main");
            })
            .catch((error) => {
                console.log("Login xatosi:", error.response?.data || error.message);
                let errorMessage = "Login muvaffaqiyatsiz, qayta urinib ko‘ring.";
                if (error.response?.data?.message === "Elektron pochta tasdiqlanmagan") {
                    errorMessage = "Emailingiz tasdiqlanmagan. Iltimos, emailingizni tekshiring va tasdiqlash havolasini bosing.";
                } else if (error.response?.data?.message === "Email yoki parol noto‘g‘ri") {
                    errorMessage = "Email yoki parol noto‘g‘ri. Iltimos, tekshirib qayta urinib ko‘ring.";
                } else {
                    // errorMessageMonths ago
                    errorMessage = error.response?.data?.message || errorMessage;
                }
                setMessage(errorMessage);
            });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', alignItems: "center" }}>
            <View>
                <Image style={{ width: 190, height: 200, marginTop: 20 }} source={require('../../assets/AnorMarket.png')} />
            </View>

            <KeyboardAvoidingView behavior="padding">
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 0.00001, color: '#041E42' }}>Hisobingizga kirish</Text>
                </View>

                <View style={{ marginTop: 70 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, backgroundColor: '#D0D0D0', paddingVertical: 1, borderRadius: 8 }}>
                        <MaterialIcons style={{ marginLeft: 10 }} name="email" size={24} color="gray" />
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={{ backgroundColor: '#D0D0D0', width: 380, flex: 1, color: 'gray', padding: 0.5, fontSize: email ? 16 : 16 }}
                            placeholder="Emailingizni kiriting"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            theme={{ colors: { primary: 'gray' } }}
                        />
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, backgroundColor: '#D0D0D0', paddingVertical: 5, borderRadius: 8, width: 360, paddingRight: 10 }}>
                        <AntDesign style={{ marginLeft: 10 }} name="lock1" size={24} color="gray" />
                        <TextInput
                            style={{ backgroundColor: '#D0D0D0', width: 260, flex: 1, color: 'gray', padding: 0.5, fontSize: password ? 16 : 16 }}
                            placeholder="Parolingizni kiriting"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={!showPassword}
                            theme={{ colors: { primary: 'gray' } }}
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

                {message && (
                    <View style={{ marginTop: 10, alignItems: "center" }}>
                        <Text style={{ color: "red", textAlign: "center" }}>{message}</Text>
                        {message.includes("tasdiqlanmagan") && (
                            <Pressable
                                onPress={() => {
                                    axios
                                        .post("http://192.168.248.10:8000/resend-verification", { email: email.trim().toLowerCase() })
                                        .then(() => {
                                            setMessage("Tasdiqlash emaili qayta yuborildi. Iltimos, emailingizni tekshiring.");
                                        })
                                        .catch((error) => {
                                            setMessage("Email qayta yuborishda xato: " + (error.response?.data?.message || error.message));
                                        });
                                }}
                            >
                                <Text style={{ color: "#007FFF", marginTop: 5 }}>Tasdiqlash emailini qayta yuborish</Text>
                            </Pressable>
                        )}
                    </View>
                )}

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, width: 360 }}>
                    <Text>Meni tizimda saqlab qo‘yish</Text>
                    <Text style={{ color: "#007FFF", fontWeight: '500' }}>Parolni unutdingizmi?</Text>
                </View>
                <View style={{ marginTop: 80 }} />
                <Pressable
                    onPress={handleLogin}
                    style={{ width: 200, backgroundColor: '#FEBE10', borderRadius: 6, marginLeft: "auto", marginRight: 'auto', padding: 15 }}
                >
                    <Text style={{ textAlign: 'center', color: "#ffff", fontSize: 16, fontWeight: 'bold' }}>Tizimga kirish</Text>
                </Pressable>

                <Pressable onPress={() => navigation.navigate("Register")} style={{ marginTop: 16 }}>
                    <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>Hisobingiz yo‘qmi? Ro‘yxatdan o‘ting</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScrin;

const styles = StyleSheet.create({});