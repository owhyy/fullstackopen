import Constants from "expo-constants";
import { Pressable, StyleSheet, View, Text, StatusBar } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#24292e',
    paddingBottom: 15,
  },
  text: {
    color: "#ffffff",
    paddingTop: 25,
    fontWeight: '700'
  }
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <Pressable>
        <Text style={styles.text}>Repositories</Text>
      </Pressable>
    </View>
  );
};

export default AppBar;
