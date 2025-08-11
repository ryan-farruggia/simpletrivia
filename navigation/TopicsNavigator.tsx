// navigation/TopicsNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { TopicsStackParamList } from './types';

// Screens for the topics flow
import TopicsScreen from '../pages/TopicsScreen';
import DifficultyScreen from '../pages/DifficultyScreen';
import QuestionCountScreen from '../pages/QuestionCountScreen';

const TopicsStack = createNativeStackNavigator<TopicsStackParamList>();

export default function TopicsNavigator() {
  return (
    <TopicsStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <TopicsStack.Screen name="TopicList" component={TopicsScreen} />
      <TopicsStack.Screen name="Difficulty" component={DifficultyScreen} />
      <TopicsStack.Screen
        name="QuestionCount"
        component={QuestionCountScreen}
      />
    </TopicsStack.Navigator>
  );
}
