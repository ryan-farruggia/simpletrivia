import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import NavButton from '../components/NavButton';
import CustomText from '../components/CustomText';
import ExternalLink from '../components/ExternalLink';

const AboutScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomText style={[styles.title, { color: colors.text }]}>About</CustomText>
      <CustomText style={[styles.desc, { color: colors.text }]}>
        Created by @.biscuit on discord
      </CustomText>
      <CustomText style={[styles.desc, { color: colors.text }]}>
        If you're feeling generous:
      </CustomText>
      <ExternalLink
        url="https://ko-fi.com/biscuit_090"
        textValue="Buy me a coffee"
        buttonStyle={{ marginBottom: 10, borderColor: colors.border }}
      />
      <NavButton
        label="Back to Home"
        targetPage="Home"
        style={{ borderColor: colors.border }}
        soundFile={{ name: 'general', type: 'mp3' }}
      />
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
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  desc: {
    fontSize: 30,
    fontFamily: 'Jersey25-Regular',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  mainbtn: {
    padding: 20,
  },
});

export default AboutScreen;
