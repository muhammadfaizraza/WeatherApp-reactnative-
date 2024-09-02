import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View } from 'react-native';
import Index from "./index"

// Removed Tabs import
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // Removed Tabs component
    <View style={{ flex: 1 }}>
 <Index/>
    </View>
  );
}
