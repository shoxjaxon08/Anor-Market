import { StyleSheet, Text, View,SafeAreaView } from "react-native";
import React ,{useEffect} from "react";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const OrderScreen = () => {
    const navigation = useNavigation()
    useEffect(() => {
        setTimeout(() => {
          navigation.replace("Main");
        }, 2600);
      }, []);
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <LottieView
        source={require("../../assets/thumbs.json")}
        // ref={animation}
        style={{
          height: 360,
          width: 400,
          alignSelf: "center",
          marginTop: 90,
          justifyContent: "center",
        }}
        autoPlay
        loop={false}
        speed={0.7}
      />
      <Text
        style={{
          marginTop: 20,
          fontSize: 19,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
       Buyurtmangiz qabul qilindi
      </Text>
      <LottieView
        source={require("../../assets/sparkle.json")}
        style={{
          height: 400,
          position: "absolute",
          top: 100,
          width: 300,
          alignSelf: "center",
        }}
        autoPlay
        loop={false}
        speed={0.7}
      />
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({});