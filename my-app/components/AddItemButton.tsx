import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddItemButtonProps {
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  isPressed: boolean;
  uploading: boolean;
  size?: 'small' | 'large';
}

export default function AddItemButton({
  onPress,
  onPressIn,
  onPressOut,
  isPressed,
  uploading,
  size = 'small'
}: AddItemButtonProps) {
  const isLarge = size === 'large';

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={uploading}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: isLarge ? 0 : 16,
        width: isLarge ? 80 : 60,
        height: isLarge ? 80 : 60,
        borderRadius: 12,
        backgroundColor: '#e0e7ff',
        borderWidth: 2,
        borderColor: isPressed ? '#667eea' : '#d1d5db',
        opacity: uploading ? 0.6 : 1,
      }}
    >
      {uploading ? (
        <ActivityIndicator size="small" color="#667eea" />
      ) : (
        <Ionicons
          name="add"
          size={isLarge ? 40 : 32}
          color={isPressed ? '#667eea' : '#a3a3a3'}
        />
      )}
    </TouchableOpacity>
  );
}
