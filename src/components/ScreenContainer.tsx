import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewProps } from 'react-native';
import { COLORS } from '../constants/theme';

type ScreenContainerProps = ViewProps & {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export const ScreenContainer = ({ children, style, ...props }: ScreenContainerProps) => {
  return (
    <View style={[styles.outer, style]} {...props}>
      <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1 },
});
