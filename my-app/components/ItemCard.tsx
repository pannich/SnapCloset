import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';

interface ItemCardProps {
  item: {
    item_id: number;
    item_image_url: string;
    item_name?: string;
  };
  size?: 'small' | 'large';
  isGrid?: boolean;
  showDeleteMode: boolean;
  onLongPress: () => void;
  onDelete: (itemId: number) => void;
}

export default function ItemCard({
  item,
  size = 'small',
  isGrid = false,
  showDeleteMode,
  onLongPress,
  onDelete
}: ItemCardProps) {
  
  console.log('ItemCard render → isGrid:', isGrid);


  const isLarge = size === 'large';

  return (
    <View style={{
      alignItems: 'center',
      marginRight: isGrid ? 16 : (isLarge ? 0 : 16),
      marginBottom: isGrid ? 16 : (isLarge ? 16 : 0),
      width: isLarge ? '48%' : undefined,
    }}>
      <View style={{ position: 'relative', overflow: 'visible' }}>
        <TouchableOpacity
          onLongPress={onLongPress}
          delayLongPress={500}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: item.item_image_url }}
            style={{
              width: isLarge ? '100%' : 60,
              height: isLarge ? 120 : 60,
              borderRadius: 12,
              backgroundColor: '#f1f5f9'
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        {showDeleteMode && (
          <TouchableOpacity
            onPress={() => onDelete(item.item_id)}
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: '#ef4444',
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 20,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
