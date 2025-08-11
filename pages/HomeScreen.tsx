import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavButton from '../components/NavButton';
import CustomText from '../components/CustomText';
import { useTheme } from '@react-navigation/native';
import { ThemedView } from '../components/Themed';
import DevNukeButton from '../components/DevNukeButton';


const HomeScreen = () => {
  const { colors } = useTheme();
  return (
    <ThemedView style={styles.container}>
      <CustomText style={styles.title}>Simple</CustomText>
      <CustomText style={[styles.title, {marginBottom: 12}]}>Trivia</CustomText>
      <NavButton label="Start Game" targetPage="Game" style={{backgroundColor: colors.card}} />
      <NavButton label="Choose a Topic" targetPage="Topics" />
      <NavButton label="Settings" targetPage="Settings" />
      <NavButton label="About" targetPage="About" />
      <DevNukeButton style={{ marginTop: 16 }} onDone={() => {
  // optional: e.g., refetch preview data, or navigate, etc.
}} />
      <View style={[styles.tip, {backgroundColor: colors.card}]}>
        <CustomText style={styles.notice}>Tip:</CustomText>
        <CustomText style={[styles.notice, {marginTop: 8}]}>Visit Settings for dark mode!</CustomText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 64, textAlign: 'center', textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 5 },
    textShadowRadius: 10
  },
  tip: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
  },
  notice: { fontSize: 24 }
});

export default HomeScreen;