import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import ItemCard from './ItemCard';
import AddItemButton from './AddItemButton';

interface Item {
  item_id: number;
  item_image_url: string;
  item_name?: string;
}

interface ItemsDisplayProps {
  items: Item[];
  showAllItems: boolean;
  showDeleteMode: boolean;
  uploading: boolean;
  addBtnPressed: boolean;
  onAddItem: () => void;
  onAddBtnPressIn: () => void;
  onAddBtnPressOut: () => void;
  onLongPress: () => void;
  onDelete: (itemId: number) => void;
  onToggleDeleteMode: () => void;
}

export default function ItemsDisplay({
  items,
  showAllItems,
  showDeleteMode,
  uploading,
  addBtnPressed,
  onAddItem,
  onAddBtnPressIn,
  onAddBtnPressOut,
  onLongPress,
  onDelete,
  onToggleDeleteMode
}: ItemsDisplayProps) {
  const reversedItems = [...items].reverse();

  if (!showAllItems) {
    // Horizontal scroll view for recent items
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20, overflow: 'visible' }}>
        <AddItemButton
          onPress={onAddItem}
          onPressIn={onAddBtnPressIn}
          onPressOut={onAddBtnPressOut}
          isPressed={addBtnPressed}
          uploading={uploading}
          size="small"
        />

        {reversedItems.slice(0, 5).map((item) => (
          <ItemCard
            key={item.item_id}
            item={item}
            size="small"
            isGrid={false}
            showDeleteMode={showDeleteMode}
            onLongPress={onLongPress}
            onDelete={onDelete}
          />
        ))}

        {showDeleteMode && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
            activeOpacity={1}
            onPress={onToggleDeleteMode}
          />
        )}
      </ScrollView>
    );
  }

  // Vertical grid view for all items
  return (
    <View style={{ marginBottom: 20 }}>
      {/* Grid of all items including add button */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      }}>
        <AddItemButton
          onPress={onAddItem}
          onPressIn={onAddBtnPressIn}
          onPressOut={onAddBtnPressOut}
          isPressed={addBtnPressed}
          uploading={uploading}
          size="small"
        />

        {reversedItems.map((item) => (
          <ItemCard
            key={item.item_id}
            item={item}
            size="small"
            isGrid={true}
            showDeleteMode={showDeleteMode}
            onLongPress={onLongPress}
            onDelete={onDelete}
          />
        ))}
      </View>

      {showDeleteMode && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
          activeOpacity={1}
          onPress={onToggleDeleteMode}
        />
      )}
    </View>
  );
}
