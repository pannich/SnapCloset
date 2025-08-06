import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../supabase/supabaseClient'; // Adjust the import path as necessary
import { useAuth } from '../../provider/AuthProvider';
import { Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

type Item = {
  user_id: string;
  item_name: string;
  item_description: string;
  item_image_url: string;
};

export default function CollectionsScreen() {
  const { user } = useAuth();
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [stylingAdvice, setStylingAdvice] = useState<string | null>("Tap the button to get styling advice!");
  const [stylingImage, setStylingImage] = useState<string | null>(null);


  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      const fetchItems = async () => {
        const { data, error } = await supabase
          .from('user_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching items:', error);
          setError(error.message);
        } else {
          const newItems = data || [];
          setItems(newItems);
          // Clear selectedItem if it no longer exists
          const exists = selectedItem && newItems.some(item => item.item_image_url === selectedItem.item_image_url);
          if (!exists) {
            setSelectedItem(newItems.length > 0 ? newItems[0] : null);
          }
        }
      };

      fetchItems();
    }, [user])
  );

  const getStylingImage = async () => {
    try {
      setIsLoadingImage(true);
      const { data, error } = await supabase.functions.invoke('get-styling-image', {
        body: {
          season: "summer",
          style: "chic",
          selected_image_url: selectedItem?.item_image_url, // send current item image
        },
      });

      if (error) {
        console.error("Function error:", error);
        setStylingAdvice("Error: " + error.message);
      } else {
        // ✅ Match OpenAI function response schema
        const advice = data?.text_instructions ?? "No styling instructions provided.";
        const image = data?.base64_images?.[0] ?? null;

        setStylingAdvice(advice);
        setStylingImage(image);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setStylingAdvice("Something went wrong. Try again.");
    } finally {
      setIsLoadingImage(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Collections</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="funnel" size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      {/* All content below should scroll */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: 40
        }}
      >
        
        {/* Selected Item Bar */}
        <View style={styles.selectedBar}>
          {selectedItem ? (
            <Image source={{ uri: selectedItem.item_image_url }} style={styles.preview} />
          ) : (
            <View style={[styles.preview, styles.placeholder]}>
              {/* Optional placeholder icon or text */}
            </View>
          )}
        </View>

        {/* Wardrobe Items Section */}
        <View style={[styles.section, { position: 'relative', minHeight: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wardrobe Items</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10, overflow: 'visible' }}>
            {/* Item cards */}
            {[...items].reverse().map((item) => (
              <View key={item.item_image_url} style={{ alignItems: 'center', marginRight: 16 }}>
                <View style={{ position: 'relative', overflow: 'visible' }}>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedItem(item)}>
                    <Image
                      source={{ uri: item.item_image_url }}
                      style={{ width: 60, height: 60, borderRadius: 12, backgroundColor: '#f1f5f9' }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Styling Advice Button */}
        <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
          <TouchableOpacity
            onPress={getStylingImage}
            style={{
              backgroundColor: '#667eea',
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Get Styling Advice
            </Text>
          </TouchableOpacity>
        </View>

        {/* Display Styling Advice */}
        {stylingAdvice && (
          <View style={styles.adviceBox}>
            <ScrollView style={styles.scrollableAdvice}>
                <Text numberOfLines={10} ellipsizeMode="tail" style={styles.adviceText}>
                  {stylingAdvice}
                </Text> 
            </ScrollView>
          </View>
        )}
        {stylingImage && (
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            {isLoadingImage ? (
              <ActivityIndicator size="large" color="#667eea" />
            ) : stylingImage ? (
              <>
                <Image
                  source={{ uri: `data:image/png;base64,${stylingImage}` }}
                  style={{ width: 200, height: 200, borderRadius: 12, backgroundColor: '#f1f5f9' }}
                  resizeMode="cover"
                />
                <Text style={{ marginTop: 8, color: '#64748b' }}>Generated Outfit Preview</Text>
              </>
            ) : (
              <View
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 12,
                  backgroundColor: '#f1f5f9',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#cbd5e1',
                }}
              >
                <Text style={{ textAlign: 'center', color: '#94a3b8', paddingHorizontal: 12 }}>
                  Your styling image will appear here once it’s generated.
                </Text>
              </View>
            )}
          </View>

        )}

        <View style={{ alignItems: 'center', marginTop: 16 }}>
          {stylingImage ? (
            <>
              <Image
                source={{ uri: stylingImage }}
                style={{ width: 200, height: 200, borderRadius: 12, backgroundColor: '#f1f5f9' }}
                resizeMode="cover"
              />
              <Text style={{ marginTop: 8, color: '#64748b' }}>Generated Outfit Preview</Text>
            </>
          ) : (
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 12,
                backgroundColor: '#f1f5f9',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#cbd5e1',
              }}
            >
              <Text style={{ textAlign: 'center', color: '#94a3b8', paddingHorizontal: 12 }}>
                Your styling image will appear here once it’s generated.
              </Text>
            </View>
          )}
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
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
  selectedBar: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    resizeMode: 'cover',
    backgroundColor: '#f1f5f9',
  },
  placeholder: {
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
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
  scrollableAdvice: {
    maxHeight: 200, // or whatever fits your layout
},
  adviceBox: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  adviceText: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 22,
  },
});
