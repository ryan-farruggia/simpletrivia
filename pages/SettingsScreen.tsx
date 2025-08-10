import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import CustomText from '../components/CustomText';
import NavButton from '../components/NavButton';
import VolumeSlider from '../components/VolumeSlider';
import ThemeToggle from '../components/ThemeToggle';
import { useAppTheme } from '../theme/ThemeProvider';
import SoundPlayer from 'react-native-sound-player';
import Hr from '../components/Hr';

const SFX_KEY = 'settings.sfxVolume';
const MUSIC_KEY = 'settings.musicVolume';
const THEME_KEY = 'settings.darkMode';

const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { theme, setMode } = useAppTheme();

  const [sfx, setSfx] = useState(1);     // 0..1
  const [music, setMusic] = useState(1); // 0..1

  // Load saved settings
  useEffect(() => {
    (async () => {
      const [sv, mv, dm] = await Promise.all([
        AsyncStorage.getItem(SFX_KEY),
        AsyncStorage.getItem(MUSIC_KEY),
        AsyncStorage.getItem(THEME_KEY),
      ]);
      if (sv !== null) setSfx(Number(sv));
      if (mv !== null) setMusic(Number(mv));
      if (dm) setMode(dm === 'true' ? 'dark' : 'light');
    })();
  }, [setMode]);

  // Persist + apply SFX volume to SoundPlayer
  useEffect(() => {
    AsyncStorage.setItem(SFX_KEY, String(sfx));
    try {
      // applies to current SoundPlayer instance (does not change device volume)
      SoundPlayer.setVolume(sfx);
    } catch {}
  }, [sfx]);

  // Persist music volume (wire this to your music player when added)
  useEffect(() => {
    AsyncStorage.setItem(MUSIC_KEY, String(music));
    // If you later use react-native-track-player: await TrackPlayer.setVolume(music);
  }, [music]);

  const previewClick = useCallback(() => {
    // play a short click at the current SFX volume
    try {
      SoundPlayer.setVolume(sfx);
      SoundPlayer.playSoundFile('general_button_click', 'mp3');
    } catch {}
  }, [sfx]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomText style={styles.title}>Settings</CustomText>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <VolumeSlider label="SFX Volume" value={sfx} onChange={setSfx} onPreview={previewClick} />
        <Hr thickness={2} dashed/>
        <VolumeSlider label="Music Volume" value={music} onChange={setMusic} containerStyle={{marginTop: 10}} />
        <ThemeToggle value={theme.mode === 'dark'} onChange={(v) => setMode(v ? 'dark' : 'light')} />
      </View>

      <NavButton label="Back to Home" targetPage="Home" style={{ borderColor: colors.border, marginTop: 10 }} />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 80,
    fontFamily: 'Jersey25-Regular',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 20,
    marginBottom: 16,
  },
  section: { width: '100%', borderRadius: 12, padding: 16, borderWidth: 2 },
});
