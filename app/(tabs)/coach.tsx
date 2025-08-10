import SuggestionShimmer from '@/components/SuggestionShimmer';
import { PookieColors } from '@/constants/Colors';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { AISuggestion, AISuggestionsResponse } from '@/types/habit';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const [generalSuggestions, setGeneralSuggestions] = useState<AISuggestion[]>([]);
  const [fitnessSuggestions, setFitnessSuggestions] = useState<AISuggestion[]>([]);
  const [nutritionSuggestions, setNutritionSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFitness, setLoadingFitness] = useState(true);
  const [loadingNutrition, setLoadingNutrition] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchGet, fetchPost } = useApi();
  const router = useRouter();
  const { showToast } = useToast();

  const loadGeneralSuggestions = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      
      const response = await fetchGet('/suggestions') as AISuggestionsResponse;
      
      if (response.success && response.data) {
        setGeneralSuggestions(Array.isArray(response.data) ? response.data : response.data.suggestions);
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

  const loadFitnessSuggestions = async () => {
    try {
      setLoadingFitness(true);
      const response = await fetchGet('/suggestions/category/fitness') as AISuggestionsResponse;
      
      if (response.success && response.data) {
        setFitnessSuggestions(Array.isArray(response.data) ? response.data : response.data.suggestions);
      } else {
        console.warn('Failed to load fitness suggestions');
      }
    } catch (err) {
      console.error('Error loading fitness suggestions:', err);
    } finally {
      setLoadingFitness(false);
    }
  };

  const loadNutritionSuggestions = async () => {
    try {
      setLoadingNutrition(true);
      const response = await fetchGet('/suggestions/category/nutrition') as AISuggestionsResponse;
      
      if (response.success && response.data) {
        setNutritionSuggestions(Array.isArray(response.data) ? response.data : response.data.suggestions);
      } else {
        console.warn('Failed to load nutrition suggestions');
      }
    } catch (err) {
      console.error('Error loading nutrition suggestions:', err);
    } finally {
      setLoadingNutrition(false);
    }
  };

  useEffect(() => {
    loadGeneralSuggestions();
    loadFitnessSuggestions();
    loadNutritionSuggestions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadGeneralSuggestions(true);
    loadFitnessSuggestions();
    loadNutritionSuggestions();
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

  const SuggestionCard = ({ suggestion }: { suggestion: AISuggestion }) => {
    const [expanded, setExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const iconName = ICON_MAP[suggestion.icon_id] || 'help-circle';
    
    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    const onTextLayout = (e: any) => {
      const { lineHeight } = e.nativeEvent;
      const maxLines = 3;
      const maxHeight = lineHeight * maxLines;
      const currentHeight = e.nativeEvent.lines.reduce((acc: number, line: any) => {
        return acc + line.height;
      }, 0);
      
      setShowReadMore(currentHeight > maxHeight);
    };

    const getCategoryColor = (category: string) => {
      switch (category.toLowerCase()) {
        case 'fitness':
          return '#6366f1';
        case 'nutrition':
          return '#10b981';
        default:
          return PookieColors.hotPink;
      }
    };

    const categoryColor = getCategoryColor(suggestion.category);

    return (
      <View style={styles.suggestionCard}>
        <View style={styles.suggestionHeader}>
          <View style={[styles.suggestionIcon, { backgroundColor: `${categoryColor}20` }]}>
            <Ionicons name={iconName as any} size={20} color={categoryColor} />
          </View>
          <View style={styles.suggestionTitleContainer}>
            <Text style={styles.suggestionTitle}>{suggestion.name}</Text>
            <View style={styles.suggestionMetaContainer}>
              <View style={[styles.categoryTag, { backgroundColor: `${categoryColor}20` }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {suggestion.category}
                </Text>
              </View>
              <Text style={styles.difficultyText}>
                {suggestion.difficulty}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: categoryColor }]}
            onPress={() => handleAddHabit(suggestion)}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Text 
            style={styles.suggestionDescription} 
            numberOfLines={expanded ? undefined : 3}
            onTextLayout={onTextLayout}
          >
            {suggestion.description}
          </Text>
          {showReadMore && (
            <TouchableOpacity onPress={toggleExpand} style={styles.readMoreButton}>
              <Text style={[styles.readMoreText, { color: categoryColor }]}>
                {expanded ? 'Read Less' : 'Read More'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
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
          <View style={[styles.tipsContainer, { borderLeftColor: categoryColor }]}>
            <Text style={styles.tipsTitle}>Success Tips</Text>
            {suggestion.success_tips.map((tip, i) => (
              <View key={`tip-${i}`} style={styles.tipItem}>
                <View style={[styles.tipBulletContainer, { backgroundColor: `${categoryColor}20` }]}>
                  <Text style={[styles.tipBullet, { color: categoryColor }]}>•</Text>
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderSuggestionCard = (suggestion: AISuggestion, key: string) => {
    return <SuggestionCard suggestion={suggestion} key={key} />;
  };

  const navigateToAllSuggestions = (category: string, suggestions: AISuggestion[]) => {
    router.push({
      pathname: '/suggestions/[category]',
      params: { 
        category,
        suggestions: JSON.stringify(suggestions)
      }
    } as any);
  };

  const renderCategorySection = ({
    title,
    icon,
    color,
    suggestions,
    loading,
    categoryKey,
    subtitle
  }: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    suggestions: AISuggestion[];
    loading: boolean;
    categoryKey: string;
    subtitle: string;
  }) => {
    if (loading) return null;
    if (suggestions.length === 0) return null;

    const mainSuggestion = suggestions[0];
    const hasMore = suggestions.length > 1;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <View style={[styles.sectionIcon, { backgroundColor: `${color}20` }]}>
              <Ionicons name={icon} size={20} color={color} />
            </View>
            <View>
              <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
              <Text style={styles.sectionSubtitle}>{subtitle}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.suggestionsContainer}>
          {renderSuggestionCard(mainSuggestion, `${categoryKey}-0`)}
          
          {hasMore && (
            <TouchableOpacity 
              style={[styles.viewAllButton, { borderColor: color }]}
              onPress={() => navigateToAllSuggestions(categoryKey, suggestions)}
            >
              <Text style={[styles.viewAllText, { color }]}>View All {suggestions.length} Suggestions</Text>
              <Ionicons name="chevron-forward" size={16} color={color} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => loadGeneralSuggestions()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const hasGeneralSuggestions = generalSuggestions.length > 0;
    const hasFitnessSuggestions = fitnessSuggestions.length > 0;
    const hasNutritionSuggestions = nutritionSuggestions.length > 0;

    if (!hasGeneralSuggestions && !hasFitnessSuggestions && !hasNutritionSuggestions) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="bulb-outline" size={48} color="#666" />
          <Text style={styles.emptyStateText}>No suggestions available</Text>
          <Text style={styles.emptyStateSubtext}>
            Check back later for personalized habit suggestions
          </Text>
        </View>
      );
    }

    return (
      <ScrollView>
        {renderCategorySection({
          title: 'Fitness Suggestions',
          icon: 'fitness',
          color: '#6366f1',
          suggestions: fitnessSuggestions,
          loading: loadingFitness,
          categoryKey: 'fitness',
          subtitle: 'Personalized workout and fitness recommendations'
        })}

        {renderCategorySection({
          title: 'Nutrition Suggestions',
          icon: 'nutrition',
          color: '#10b981',
          suggestions: nutritionSuggestions,
          loading: loadingNutrition,
          categoryKey: 'nutrition',
          subtitle: 'Healthy eating habits and meal planning'
        })}

        {renderCategorySection({
          title: 'General Suggestions',
          icon: 'bulb-outline',
          color: '#8b5cf6',
          suggestions: generalSuggestions,
          loading: loading,
          categoryKey: 'general',
          subtitle: 'Habits to improve your daily routine'
        })}
      </ScrollView>
    );
  };

  if (loading && !refreshing) {
    return <SuggestionShimmer />;
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
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light background
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
    backgroundColor: '#f0f0f0', // Light background
    borderRadius: 16,
    marginTop: 16,
  },
  emptyStateText: {
    color: '#11181C', // Dark text
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#687076', // Medium gray text
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
    color: '#11181C', // Dark text
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  suggestionsContainer: {
    paddingBottom: 0,
  },
  section: {
    marginBottom: 24,
    // backgroundColor: '#f0f0f0', // Light background
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C', // Dark text
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#888',
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
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareText: {
    color: '#000',
    marginLeft: 4,
    fontSize: 12,
  },
  tipText: {
    color: '#000',
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
    color: '#000',
    marginLeft: 8,
  },
  warningText: {
    color: '#000',
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
    color: '#000',
    marginLeft: 8,
  },
  recText: {
    color: '#000',
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
    color: '#000',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  // Suggestion Card Styles
  suggestionCard: {
    backgroundColor: '#f0f0f0', // Light background
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionTitleContainer: {
    flex: 1,
  },
  suggestionTitle: {
    color: '#11181C', // Dark text
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  suggestionMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyText: {
    color: '#888',
    fontSize: 11,
    fontWeight: '500',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  addButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 12,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  suggestionDescription: {
    color: '#687076', // Darker text for contrast
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.2,
  },
  readMoreButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '500',
  },
  suggestionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 16,
    borderLeftWidth: 3,
    marginTop: 4,
  },
  tipsTitle: {
    color: '#11181C', // Dark text
    fontWeight: '600',
    marginBottom: 10,
    fontSize: 14,
    opacity: 0.9,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tipBulletContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  tipBullet: {
    fontSize: 16,
    lineHeight: 16,
  },
}); 