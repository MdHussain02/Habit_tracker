import SuggestionShimmer from '@/components/SuggestionShimmer';
import colors from '@/constants/Colors';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { AISuggestion, AISuggestionsResponse } from '@/types/habit';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
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
          return  colors.primary;
        case 'nutrition':
          return  colors.primary;
        default:
          return colors.primary;
      }
    };

    const categoryColor = getCategoryColor(suggestion.category);

    return (
      <View style={styles.suggestionCard}>
        <View style={styles.suggestionHeader}>
          <View style={[styles.suggestionIcon, { backgroundColor: `${categoryColor}10` }]}>
            <Ionicons name={iconName as any} size={24} color={categoryColor} />
          </View>
          <View style={styles.suggestionTitleContainer}>
            <Text style={styles.suggestionTitle}>{suggestion.name}</Text>
            <View style={styles.suggestionMetaContainer}>
              <View style={[styles.categoryTag, { backgroundColor: `${categoryColor}10` }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {suggestion.category}
                </Text>
              </View>
              <View style={[styles.difficultyTag, { backgroundColor: getDifficultyColor(suggestion.difficulty) }]}>
                <Text style={styles.difficultyText}>
                  {suggestion.difficulty}
                </Text>
              </View>
            </View>
          </View>
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
              <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={categoryColor} style={styles.readMoreIcon} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.suggestionMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={colors['text-secondary']} />
            <Text style={styles.metaText}>{formatTime(suggestion.target_time)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="repeat" size={16} color={colors['text-secondary']} />
            <Text style={styles.metaText}>{formatRepeats(suggestion.repeats)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="timer-outline" size={16} color={colors['text-secondary']} />
            <Text style={styles.metaText}>{suggestion.estimated_duration} min</Text>
          </View>
        </View>
        
        {suggestion.success_tips.length > 0 && (
          <View style={styles.tipsContainer}>
            <Text style={[styles.tipsTitle, { color: categoryColor }]}>Success Tips</Text>
            {suggestion.success_tips.map((tip, i) => (
              <View key={`tip-${i}`} style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={categoryColor} style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: categoryColor }]}
          onPress={() => handleAddHabit(suggestion)}
        >
          <Text style={styles.addButtonText}>Add Habit</Text>
          <Ionicons name="add" size={18} color="#fff" style={styles.addButtonIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#d1fae5'; // Soft green
      case 'medium':
        return '#fef3c7'; // Soft yellow
      case 'hard':
        return '#fee2e2'; // Soft red
      default:
        return '#f3f4f6'; // Gray
    }
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

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <View style={[styles.sectionIcon, { backgroundColor: `${color}10` }]}>
              <Ionicons name={icon} size={24} color={color} />
            </View>
            <View>
              <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
              <Text style={styles.sectionSubtitle}>{subtitle}</Text>
            </View>
          </View>
          {suggestions.length > 0 && (
            <TouchableOpacity 
              style={[styles.viewAllButton, { borderColor: color }]} 
              onPress={() => navigateToAllSuggestions(categoryKey, suggestions)}
            >
              <Text style={[styles.viewAllText, { color }]}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={color} />
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          data={suggestions.slice(0, 3)} // Show up to 3 suggestions per section for better UX
          renderItem={({ item }) => <SuggestionCard suggestion={item} />}
          keyExtractor={(item, index) => `${categoryKey}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        />
      </View>
    );
  };

  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors['text-danger']} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => loadGeneralSuggestions()}
          >
            <Ionicons name="refresh" size={18} color="#fff" style={styles.retryIcon} />
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
          <Ionicons name="bulb-outline" size={64} color={colors['text-secondary']} />
          <Text style={styles.emptyStateText}>No Suggestions Yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Our AI is cooking up some personalized habits for you. Check back soon!
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        {renderCategorySection({
          title: 'Fitness',
          icon: 'fitness',
          color:  colors.primary,
          suggestions: fitnessSuggestions,
          loading: loadingFitness,
          categoryKey: 'fitness',
          subtitle: 'Build strength and stay active'
        })}

        {renderCategorySection({
          title: 'Nutrition',
          icon: 'nutrition',
          color:  colors.primary,
          suggestions: nutritionSuggestions,
          loading: loadingNutrition,
          categoryKey: 'nutrition',
          subtitle: 'Fuel your body right'
        })}

        {renderCategorySection({
          title: 'General',
          icon: 'bulb-outline',
          color:  colors.primary,
          suggestions: generalSuggestions,
          loading: loading,
          categoryKey: 'general',
          subtitle: 'Everyday wellness habits'
        })}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Smart Coach</Text>
          <Text style={styles.headerDate}>Your AI-Powered Habit Guide</Text>
        </View>
        <View style={styles.loadingContainer}>
          <SuggestionShimmer />
          <SuggestionShimmer />
          <SuggestionShimmer />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Smart Coach</Text>
        <Text style={styles.headerDate}>Your AI-Powered Habit Guide</Text>
      </View>

      <FlatList 
        data={[]} // Using FlatList for better performance and refresh
        renderItem={() => null}
        ListHeaderComponent={renderContent}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['bg-light'],
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors['text-light'],
  },
  headerDate: {
    fontSize: 16,
    color: colors['text-light'],
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors['text-secondary'],
    opacity: 0.8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  horizontalList: {
    paddingRight: 24,
  },
  suggestionCard: {
    backgroundColor: colors['bg-accent'],
    borderRadius: 24,
    padding: 20,
    width: width * 0.85,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: colors['border-light'],
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  suggestionTitleContainer: {
    flex: 1,
  },
  suggestionTitle: {
    color: colors['text-primary'],
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  suggestionMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  difficultyTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors['text-primary'],
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  suggestionDescription: {
    color: colors['text-secondary'],
    fontSize: 14,
    lineHeight: 22,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  readMoreIcon: {
    marginLeft: 4,
  },
  suggestionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 12,
    backgroundColor: colors['bg-secondary'],
    borderRadius: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: colors['text-primary'],
    fontSize: 13,
    fontWeight: '500',
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipsTitle: {
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 16,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  tipBullet: {
    marginRight: 12,
  },
  tipText: {
    color: colors['text-secondary'],
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  addButtonIcon: {},
  loadingContainer: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  errorText: {
    color: colors['text-danger'],
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: colors['bg-dark'],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    gap: 8,
  },
  retryIcon: {},
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  emptyStateText: {
    color: colors['text-primary'],
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: colors['text-secondary'],
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});