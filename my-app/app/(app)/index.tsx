import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../../supabase/supabaseClient';
import { decode } from 'base64-arraybuffer';
// import { Fileobject } from '@supabase/storage-js';

import { useAuth } from '../../provider/AuthProvider';

export default function HomeScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Mock userId for testing - in real app this would come from auth
  console.log("******* User :", user?.email, user?.id);

  useEffect(() => {
    if (!user) {
      console.warn('No user logged in, skipping fetchItems');
      return;
    }

    async function fetchItems() {
      const { data, error } = await supabase
        .from('user_items')
        .select('*');

      if (error) {
        console.error('Error fetching user_items:', error);
        setError(error.message);
      } else {
        // console.log('Fetched user_items:', data);
        setItems(data || []);
      }
    }

    fetchItems();
  }, [user]);

  // Function to add item image
  const addItemImage = async () => {
    try {
      setUploading(true);

      // 1. Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photo library');
        return;
      }

      // 2. Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      const actualUserId = "01c5722d-5c5f-43ba-878a-0228c23e3747" // Replace with actual user ID from auth context

      // 3. Upload to Supabase Storage
      if (!result.canceled && result.assets[0]) {
        const img = result.assets[0];
        const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });
        const filePath = `${user!.id}/${new Date().getTime()}.${img.type === 'image' ? 'png' : 'mp4'}`;

        const contentType = img.type === 'image' ? 'image/png' : 'video/mp4';
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-images').upload(filePath, decode(base64), { contentType });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          Alert.alert('Upload Failed', 'Failed to upload image to storage');
          return;
        }

        console.log('Upload to bucket successful:', uploadData);

        // 5. Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('user-images')
          .getPublicUrl(filePath);

        console.log('Public URL:', publicUrl);

        // 4. Insert into database
        const { data: itemData, error: insertError } = await supabase
          .from('user_items')
          .insert([
            {
              user_id: user!.id,  // TODO : Auth here user!.id
              item_name: 'New Item',
              item_description: 'Item uploaded from mobile app',
              item_image_url: publicUrl,
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Database insert error:', insertError);
          Alert.alert('Database Error', 'Failed to save item to database');
          return;
        }

        console.log('Item saved to database:', itemData);
        Alert.alert('Success', 'Image uploaded and item saved successfully!');

        // 7. Refresh items list
        const { data: refreshedData } = await supabase
          .from('user_items')
          .select('*');
        setItems(refreshedData || []);

      } else {
        console.log('Image picker cancelled');
      }

    } catch (error) {
      console.error('Error in addItemImage:', error);
      Alert.alert('Error', 'Something went wrong while uploading image');
    } finally {
      setUploading(false);
    }
  };

  // Test function to add mock data
  const addMockData = async () => {
    try {
      if (!user || !user.id) {
        Alert.alert('Authentication Error', 'Please log in to add test data');
        return;
      }

      console.log('Adding mock data for user:', user.id);

      // Now add mock items
      const mockItems = [
        {
          user_id: user.id,
          item_name: 'Blue Denim Jacket',
          item_description: 'Classic blue denim jacket perfect for casual outings',
          item_image_url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop',
        },
        {
          user_id: user.id,
          item_name: 'White Sneakers',
          item_description: 'Comfortable white sneakers for everyday wear',
          item_image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        },
        {
          user_id: user.id,
          item_name: 'Black T-Shirt',
          item_description: 'Essential black t-shirt for any outfit',
          item_image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        },
        {
          user_id: user.id,
          item_name: 'Khaki Pants',
          item_description: 'Versatile khaki pants for business casual',
          item_image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
        },
      ];

      const { data: itemsData, error: itemsError } = await supabase
        .from('user_items')
        .insert(mockItems)
        .select();

      if (itemsError) {
        console.error('Error adding mock items:', itemsError);
        Alert.alert('Error', 'Failed to add mock items');
        return;
      }

      console.log('Added mock items:', itemsData);
      Alert.alert('Success', `Added ${itemsData.length} mock items!`);

      // Refresh the items list
      const { data: refreshedData } = await supabase
        .from('user_items')
        .select('*')
        .eq('user_id', user.id);
      setItems(refreshedData || []);

    } catch (error) {
      console.error('Error in addMockData:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const recentOutfits = [
    {
      id: 1,
      name: 'Summer Casual',
      date: 'Today',
      rating: 4.8,
      image: '👕',
    },
    {
      id: 2,
      name: 'Office Professional',
      date: 'Yesterday',
      rating: 4.6,
      image: '💼',
    },
    {
      id: 3,
      name: 'Weekend Vibes',
      date: '2 days ago',
      rating: 4.9,
      image: '🌞',
    },
  ];

  const styleTips = [
    {
      id: 1,
      title: 'Color Coordination',
      description: 'Learn how to match colors perfectly',
      icon: 'color-palette',
    },
    {
      id: 2,
      title: 'Body Type Styling',
      description: 'Dress for your body shape',
      icon: 'body',
    },
    {
      id: 3,
      title: 'Seasonal Trends',
      description: 'Stay updated with latest trends',
      icon: 'trending-up',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.userName}>John Doe</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* Test Button for Mock Data */}
        <TouchableOpacity
          style={styles.testButton}
          onPress={addMockData}
        >
          <Text style={styles.testButtonText}>🧪 Add Test Data</Text>
        </TouchableOpacity>

        {/* Add Item Image Button */}
        <TouchableOpacity
          style={[styles.testButton, uploading && styles.testButtonDisabled]}
          onPress={addItemImage}
          disabled={uploading}
        >
          <Text style={styles.testButtonText}>
            {uploading ? '📤 Uploading...' : '📷 Add Item Image'}
          </Text>
        </TouchableOpacity>

        {/* Display Items Count */}
        {items.length > 0 && (
          <View style={styles.itemsCount}>
            <Text style={styles.itemsCountText}>
              📦 {items.length} items in database
            </Text>
          </View>
        )}

        {/* Camera Section */}
        <TouchableOpacity
          style={styles.cameraSection}
          onPress={() => router.push('/camera')}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.cameraGradient}
          >
            <View style={styles.cameraContent}>
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={32} color="white" />
              </View>
              <Text style={styles.cameraTitle}>Capture Your Style</Text>
              <Text style={styles.cameraSubtitle}>
                Take a photo to get outfit suggestions
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#667eea' }]}>
              <Ionicons name="add" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>New Outfit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#764ba2' }]}>
              <Ionicons name="search" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Find Style</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#f093fb' }]}>
              <Ionicons name="heart" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Favorites</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Outfits */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Outfits</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentOutfits.map((outfit) => (
              <TouchableOpacity key={outfit.id} style={styles.outfitCard}>
                <View style={styles.outfitImage}>
                  <Text style={styles.outfitEmoji}>{outfit.image}</Text>
                </View>
                <Text style={styles.outfitName}>{outfit.name}</Text>
                <View style={styles.outfitMeta}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#ffd700" />
                    <Text style={styles.ratingText}>{outfit.rating}</Text>
                  </View>
                  <Text style={styles.outfitDate}>{outfit.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Style Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Style Tips</Text>
          {styleTips.map((tip) => (
            <TouchableOpacity key={tip.id} style={styles.tipCard}>
              <View style={[styles.tipIcon, { backgroundColor: '#667eea' }]}>
                <Ionicons name={tip.icon as any} size={20} color="white" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>
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
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  notificationButton: {
    padding: 5,
  },
  testButton: {
    padding: 10,
    backgroundColor: '#667eea',
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  testButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  itemsCount: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
  },
  itemsCountText: {
    fontSize: 14,
    color: '#64748b',
  },
  cameraSection: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cameraGradient: {
    padding: 24,
  },
  cameraContent: {
    alignItems: 'center',
  },
  cameraIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cameraTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  cameraSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  outfitCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 120,
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
    marginBottom: 12,
  },
  outfitEmoji: {
    fontSize: 24,
  },
  outfitName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
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
    fontSize: 10,
    color: '#64748b',
    marginLeft: 2,
  },
  outfitDate: {
    fontSize: 10,
    color: '#64748b',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#64748b',
  },
});
