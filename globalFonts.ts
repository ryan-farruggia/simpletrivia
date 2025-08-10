import React from 'react';
import { Text, TextInput } from 'react-native';

const customFont = 'Jersey25-Regular';

export function applyGlobalFont() {
  const TextRender = (Text as any).render;
  (Text as any).render = function (...args: any[]) {
    const origin = TextRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{ fontFamily: customFont }, origin.props.style],
    });
  };

  const InputRender = (TextInput as any).render;
  (TextInput as any).render = function (...args: any[]) {
    const origin = InputRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{ fontFamily: customFont }, origin.props.style],
    });
  };
}
