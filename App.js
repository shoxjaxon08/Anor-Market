import 'react-native-get-random-values';
import { StatusBar } from "expo-status-bar";
import { StyleSheet ,View} from "react-native";
import { ModalPortal } from "react-native-modals";
import { Provider } from "react-redux";
import StackNavigator from "./src/navigation/StackNavigator";
import store from "./src/redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserContext } from "./UserContext";
import { NavigationContainer } from "@react-navigation/native"; 

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserContext>
          <NavigationContainer> 
            <StackNavigator />
          </NavigationContainer>
          <ModalPortal />
        </UserContext>
      </Provider>
    </GestureHandlerRootView>
  );
}
