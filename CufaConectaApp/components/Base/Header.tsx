import { View, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Image
          source={require('../../assets/images/cufaLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.rightIcons}>
        <Feather name="menu" size={24} color="#FFFFFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B6B2F',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    position: 'relative',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 40,
    tintColor: '#FFFFFF'
  },
  rightIcons: {
    position: 'absolute',
    right: 20,
    top: 55,
    flexDirection: 'row',
    gap: 15,
  },
});