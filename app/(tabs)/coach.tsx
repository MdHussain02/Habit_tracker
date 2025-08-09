import { PookieColors } from '@/constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AISuggestion, AISuggestionsResponse } from '@/types/habit';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'expo-router';
import { useToast } from '@/hooks/useToast';
import SuggestionShimmer from '@/components/SuggestionShimmer';

// Map day numbers to day names
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Map icon IDs to Ionicons names
const ICON_MAP: Record<number, string> = {
  1: 'water',
  2: 'book',
  3: 'fitness',
  4: 'cafe',
  5: 'moon',
  6: 'walk',
  7: 'barbell',
  8: 'star',
};

export default function CoachScreen() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchGet, fetchPost } = useApi();
  const router = useRouter();
  const { showToast } = useToast();

  const loadSuggestions = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      
      const response = await fetchGet('/suggestions') as AISuggestionsResponse;
      
      if (response.success && response.data) {
        setSuggestions(response.data.suggestions);
        setError(null);
      } else {
        setError('Failed to load suggestions. Please try again.');
      }
    } catch (err) {
      console.error('Error loading suggestions:', err);
      setError('An error occurred while loading suggestions.');
    } finally {
      setLoading(false);
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSuggestions(true);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatRepeats = (days: number[]) => {
    if (days.length === 7) return 'Daily';
    if (days.length === 5 && !days.includes(5) && !days.includes(6)) return 'Weekdays';
    if (days.length === 2 && days.includes(5) && days.includes(6)) return 'Weekends';
    
    return days.map(day => DAY_NAMES[day]).join(', ');
  };

  const handleAddHabit = async (suggestion: AISuggestion) => {
    try {
      const habitData = {
        name: suggestion.name,
        target_time: suggestion.target_time,
        icon_id: suggestion.icon_id,
        repeats: suggestion.repeats,
        description: 'Created from AI suggestion'
      };

      const response = await fetchPost('/suggestions/create', habitData);
      
      if (response.success) {
        showToast('Habit created successfully!', 'success');
        // Navigate to home tab
        router.replace('/(tabs)');
      } else {
        showToast(response.error || 'Failed to create habit', 'error');
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      showToast('An error occurred while creating the habit', 'error');
    }
  };

  const renderSuggestionCard = (suggestion: AISuggestion, index: number) => {
    const iconName = ICON_MAP[suggestion.icon_id] || 'help-circle';
    
    return (
      <View key={`suggestion-${index}`} style={styles.suggestionCard}>
        <View style={styles.suggestionHeader}>
          <View style={styles.suggestionIcon}>
            <Ionicons name={iconName as any} size={24} color="#fff" />
          </View>
          <View style={styles.suggestionTitleContainer}>
            <Text style={styles.suggestionTitle}>{suggestion.name}</Text>
            <Text style={styles.suggestionCategory}>
              {suggestion.category} • {suggestion.difficulty}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddHabit(suggestion)}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
        
        <View style={styles.suggestionMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#888" />
            <Text style={styles.metaText}>{formatTime(suggestion.target_time)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="repeat" size={16} color="#888" />
            <Text style={styles.metaText}>{formatRepeats(suggestion.repeats)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="timer-outline" size={16} color="#888" />
            <Text style={styles.metaText}>{suggestion.estimated_duration} min</Text>
          </View>
        </View>
        
        {suggestion.success_tips.length > 0 && (
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Success Tips:</Text>
            {suggestion.success_tips.map((tip, i) => (
              <View key={`tip-${i}`} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return <SuggestionShimmer />;
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => loadSuggestions()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Coach</Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[PookieColors.hotPink]}
            tintColor={PookieColors.hotPink}
          />
        }>
          {/* AI Suggestions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="sparkles" size={24} color={PookieColors.hotPink} />
              <Text style={styles.sectionTitle}>AI-Powered Suggestions</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Personalized habit recommendations just for you.</Text>
            
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => renderSuggestionCard(suggestion, index))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="bulb" size={48} color="#444" />
                <Text style={styles.emptyStateText}>No suggestions available</Text>
                <Text style={styles.emptyStateSubtext}>Check back later for personalized recommendations</Text>
              </View>
            )}
          </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14141c',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: PookieColors.hotPink,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1e1e28',
    borderRadius: 16,
    marginTop: 16,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: '#22222b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PookieColors.hotPink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
  },
  tipText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  warningCard: {
    backgroundColor: '#22222b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  warningText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  warningButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  warningButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  recommendationCard: {
    backgroundColor: '#22222b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  recText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  recFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '500',
  },
  addHabitButton: {
    backgroundColor: PookieColors.hotPink,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addHabitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  // Suggestion Card Styles
  suggestionCard: {
    backgroundColor: '#22222b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PookieColors.hotPink,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionTitleContainer: {
    flex: 1,
  },
  suggestionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionCategory: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: PookieColors.hotPink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  suggestionDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  suggestionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#888',
    fontSize: 12,
    marginLeft: 4,
  },
  tipsContainer: {
    backgroundColor: '#2a2a35',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  tipsTitle: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  tipBullet: {
    color: PookieColors.hotPink,
    marginRight: 8,
  },
  tipText: {
    color: '#ccc',
    fontSize: 13,
    flex: 1,
  },
}); 