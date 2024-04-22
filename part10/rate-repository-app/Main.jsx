import Constants from "expo-constants";
import { StyleSheet, View } from "react-native";
import RepositoryList from "./components/RepositoryList";
import AppBar from "./components/AppBar";

const styles = StyleSheet.create({
  containter: {
    marginTop: Constants.statusBarHeight,
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <View>
      <AppBar />
      <RepositoryList />
    </View>
  );
};

export default Main;
