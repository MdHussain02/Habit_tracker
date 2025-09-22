import colors from '@/constants/Colors';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { AISuggestion } from '@/types/habit';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const CategorySuggestionsScreen = () => {
  const { category, suggestions: suggestionsString } = useLocalSearchParams<{
    category: string;
    suggestions: string;
  }>();
  
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [addingHabit, setAddingHabit] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { fetchPost } = useApi();
  const { showToast } = useToast();

  useEffect(() => {
    if (suggestionsString) {
      try {
        const parsed = JSON.parse(suggestionsString);
        setSuggestions(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Error parsing suggestions:', e);
      }
    }
  }, [suggestionsString]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatRepeats = (days: number[]) => {
    if (days.length === 7) return 'Daily';
    if (days.length === 5 && !days.includes(5) && !days.includes(6)) return 'Weekdays';
    if (days.length === 2 && days.includes(5) && days.includes(6)) return 'Weekends';
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => dayNames[day]).join(', ');
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'fitness':
        return colors.primary;
      case 'nutrition':
        return colors.primary;
      default:
        return colors.primary;
    }
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

  const handleAddHabit = async (suggestion: AISuggestion) => {
    try {
      const suggestionKey = suggestion.name;
      setAddingHabit(prev => ({ ...prev, [suggestionKey]: true }));
      
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
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1000);
      } else {
        showToast(response.error || 'Failed to create habit', 'error');
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      showToast('An error occurred while creating the habit', 'error');
    } finally {
      const suggestionKey = suggestion.name;
      setAddingHabit(prev => ({ ...prev, [suggestionKey]: false }));
    }
  };

  const SuggestionCard = ({ suggestion, index }: { suggestion: AISuggestion, index: number }) => {
    const [expanded, setExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const iconName = {
      'fitness': 'fitness',
      'nutrition': 'nutrition',
      'general': 'bulb-outline'
    }[suggestion.category?.toLowerCase() || 'general'] || 'help-circle';

    const categoryColor = getCategoryColor(suggestion.category);
    const isAdding = addingHabit[suggestion.name] || false;

    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    const onTextLayout = (e: any) => {
      const { lines } = e.nativeEvent;
      setShowReadMore(lines.length > 3);
    };

    return (
      <View style={styles.suggestionCard}>
        <View style={styles.suggestionHeader}>
          <View style={[styles.suggestionIcon, { backgroundColor: `${categoryColor}10` }]}>
            <Ionicons name={iconName as any} size={24} color={categoryColor} />
          </View>
          <View style={styles.suggestionTitleContainer}>
            <Text style={styles.suggestionTitle}>{suggestion.name}</Text>
            <View style={styles.suggestionMetaContainer}>
              <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}10` }]}>
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
        
        {suggestion.success_tips?.length > 0 && (
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
          style={[styles.addButton, { backgroundColor: isAdding ? colors['text-secondary'] : categoryColor }]}
          onPress={() => !isAdding && handleAddHabit(suggestion)}
          disabled={isAdding}
        >
          <Text style={styles.addButtonText}>
            {isAdding ? 'Adding...' : 'Add Habit'}
          </Text>
          {!isAdding && <Ionicons name="add" size={18} color="#fff" style={styles.addButtonIcon} />}
        </TouchableOpacity>
      </View>
    );
  };

  if (!category) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={colors['text-danger']} />
        <Text style={styles.errorText}>No category selected</Text>
        <TouchableOpacity
          style={styles.backButtonError}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>
              {category.charAt(0).toUpperCase() + category.slice(1)} Suggestions
            </Text>
            <Text style={styles.headerDate}>AI-powered habit recommendations</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={suggestions}
        renderItem={({ item, index }) => <SuggestionCard suggestion={item} index={index} />}
        keyExtractor={(item, index) => `suggestion-${index}`}
        contentContainerStyle={styles.suggestionsContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="sad-outline" size={64} color={colors['text-secondary']} />
            <Text style={styles.emptyStateText}>No Suggestions Found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try refreshing the main page to get new recommendations
            </Text>
            <TouchableOpacity
              style={styles.backButtonEmpty}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['bg-light'],
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors['text-light'],
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: colors['text-light'],
    fontWeight: '500',
    opacity: 0.9,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  suggestionCard: {
    backgroundColor: colors['bg-accent'],
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
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
  categoryBadge: {
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors['bg-light'],
    padding: 32,
    gap: 16,
  },
  errorText: {
    color: colors['text-danger'],
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  backButtonError: {
    backgroundColor: colors['bg-dark'],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  backButtonEmpty: {
    backgroundColor: colors['bg-dark'],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  backButtonText: {
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

export default CategorySuggestionsScreen;