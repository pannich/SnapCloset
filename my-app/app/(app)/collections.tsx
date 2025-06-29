import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CollectionsScreen() {
  const [activeTab, setActiveTab] = useState('outfits');

  const savedOutfits = [
    {
      id: 1,
      name: 'Summer Casual',
      date: '2024-01-15',
      rating: 4.8,
      category: 'Casual',
      image: '👕',
    },
    {
      id: 2,
      name: 'Office Professional',
      date: '2024-01-14',
      rating: 4.6,
      category: 'Formal',
      image: '💼',
    },
    {
      id: 3,
      name: 'Weekend Vibes',
      date: '2024-01-13',
      rating: 4.9,
      category: 'Casual',
      image: '🌞',
    },
    {
      id: 4,
      name: 'Evening Glam',
      date: '2024-01-12',
      rating: 4.7,
      category: 'Formal',
      image: '✨',
    },
  ];

  const savedItems = [
    {
      id: 1,
      title: 'White T-Shirt Styling Guide',
      author: 'StyleGuru',
      likes: 1247,
      type: 'article',
    },
    {
      id: 2,
      title: 'Color Coordination Tips',
      author: 'Fashionista',
      likes: 892,
      type: 'guide',
    },
    {
      id: 3,
      title: 'Minimalist Wardrobe Essentials',
      author: 'TrendSetter',
      likes: 1563,
      type: 'article',
    },
  ];

  const renderOutfits = () => (
    <View style={styles.content}>
      {savedOutfits.map((outfit) => (
        <TouchableOpacity key={outfit.id} style={styles.outfitCard}>
          <View style={styles.outfitImage}>
            <Text style={styles.outfitEmoji}>{outfit.image}</Text>
          </View>
          <View style={styles.outfitInfo}>
            <Text style={styles.outfitName}>{outfit.name}</Text>
            <Text style={styles.outfitCategory}>{outfit.category}</Text>
            <View style={styles.outfitMeta}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#ffd700" />
                <Text style={styles.ratingText}>{outfit.rating}</Text>
              </View>
              <Text style={styles.outfitDate}>{outfit.date}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#64748b" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItems = () => (
    <View style={styles.content}>
      {savedItems.map((item) => (
        <TouchableOpacity key={item.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <View style={styles.itemType}>
              <Ionicons
                name={item.type === 'article' ? 'document-text' : 'book'}
                size={16}
                color="#667eea"
              />
              <Text style={styles.itemTypeText}>
                {item.type === 'article' ? 'Article' : 'Guide'}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="heart" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemAuthor}>by {item.author}</Text>
          <View style={styles.itemStats}>
            <View style={styles.likesContainer}>
              <Ionicons name="heart" size={14} color="#ef4444" />
              <Text style={styles.likesText}>{item.likes}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Collections</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="funnel" size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'outfits' && styles.activeTab]}
          onPress={() => setActiveTab('outfits')}
        >
          <Text style={[styles.tabText, activeTab === 'outfits' && styles.activeTabText]}>
            Outfits ({savedOutfits.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'items' && styles.activeTab]}
          onPress={() => setActiveTab('items')}
        >
          <Text style={[styles.tabText, activeTab === 'items' && styles.activeTabText]}>
            Items ({savedItems.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'outfits' ? renderOutfits() : renderItems()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sortButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    paddingHorizontal: 20,
  },
  outfitCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outfitImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  outfitEmoji: {
    fontSize: 24,
  },
  outfitInfo: {
    flex: 1,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  outfitCategory: {
    fontSize: 12,
    color: '#667eea',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  outfitMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  outfitDate: {
    fontSize: 12,
    color: '#64748b',
  },
  moreButton: {
    padding: 5,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTypeText: {
    fontSize: 12,
    color: '#667eea',
    marginLeft: 6,
    fontWeight: '500',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
    lineHeight: 22,
  },
  itemAuthor: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  itemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
});
