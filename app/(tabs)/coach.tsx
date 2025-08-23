import SuggestionShimmer from '@/components/SuggestionShimmer';
import { PookieColors } from '@/constants/Colors';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { AISuggestion, AISuggestionsResponse } from '@/types/habit';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

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
      const { lines } = e.nativeEvent;
      setShowReadMore(lines.length > 3);
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
            <Ionicons name="time-outline" size={16} color="#7f8c8d" />
            <Text style={styles.metaText}>{formatTime(suggestion.target_time)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="repeat" size={16} color="#7f8c8d" />
            <Text style={styles.metaText}>{formatRepeats(suggestion.repeats)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="timer-outline" size={16} color="#7f8c8d" />
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
    if (loading && suggestions.length === 0) return null;
    if (!loading && suggestions.length === 0) return null;

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
              style={[styles.viewAllButton, { borderColor: color, backgroundColor: `${color}10` }]}
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
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color="#f87171" />
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
          <Ionicons name="bulb-outline" size={48} color="#7f8c8d" />
          <Text style={styles.emptyStateText}>No suggestions available</Text>
          <Text style={styles.emptyStateSubtext}>
            Check back later for personalized habit suggestions
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.content}>
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
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Smart Coach</Text>
              <Text style={styles.headerDate}>Your Personalized Habit Coach</Text>
            </View>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <SuggestionShimmer />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Smart Coach</Text>
            <Text style={styles.headerDate}>Your Personalized Habit Coach</Text>
          </View>
        </View>
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
        }
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateText: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#7f8c8d',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'rgba(19 230 82 / 0.39)',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#444343',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: '#161616',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  suggestionsContainer: {
    gap: 12,
  },
  suggestionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
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
    color: '#2c3e50',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  suggestionMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  difficultyText: {
    color: '#7f8c8d',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  suggestionDescription: {
    color: '#34495e',
    fontSize: 14,
    lineHeight: 20,
  },
  readMoreButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
  },
  suggestionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    backgroundColor: '#ffffff',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  metaText: {
    color: '#7f8c8d',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  tipsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderLeftWidth: 3,
  },
  tipsTitle: {
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 14,
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
    fontSize: 12,
    fontWeight: '600',
  },
  tipText: {
    color: '#34495e',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});