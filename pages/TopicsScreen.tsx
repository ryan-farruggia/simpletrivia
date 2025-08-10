import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import NavButton from '../components/NavButton';
import CustomText from '../components/CustomText';

const TopicsScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomText style={[styles.title, { color: colors.text }]}>Choose a Topic</CustomText>
      <NavButton label="Back to Home" targetPage="Home" style={{ borderColor: colors.border }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 80,
    fontFamily: 'Jersey25-Regular',
    marginTop: 0,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 20,
  },
  mainbtn: {
    padding: 20,
  },
});

export default TopicsScreen;
