import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function HomeScreen() {
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
