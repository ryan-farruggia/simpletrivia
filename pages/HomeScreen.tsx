import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavButton from '../components/NavButton';
import CustomText from '../components/CustomText';
import { useTheme } from '@react-navigation/native';
import { ThemedView } from '../components/Themed';


const HomeScreen = () => {
  const { colors } = useTheme();
  return (
    <ThemedView style={styles.container}>
      <CustomText style={styles.title}>Simple</CustomText>
      <CustomText style={[styles.title, {marginBottom: 12}]}>Trivia</CustomText>
      <NavButton label="Start Game" targetPage="Game" params={{ level: 1 }} />
      <NavButton label="Choose a Topic" targetPage="Topics" params={{ level: 1 }} />
      <NavButton label="Settings" targetPage="Settings" params={{ level: 1 }} />
      <NavButton label="About" targetPage="About" params={{ level: 1 }} />
      <View style={{marginTop: 4, alignItems: 'center', justifyContent: 'center'}}>
        <CustomText style={styles.notice}>Tip:</CustomText>
        <CustomText style={[styles.notice, {marginTop: 8}]}>Visit Settings for dark mode!</CustomText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 64, textAlign: 'center' },
  notice: { fontSize: 24 }
});

export default HomeScreen;