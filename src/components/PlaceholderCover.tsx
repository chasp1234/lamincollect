import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlaceholderCover({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.cover, { backgroundColor: color }]}> 
      <View style={styles.inner}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: 74,
    height: 104,
    borderRadius: 18,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  inner: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
});