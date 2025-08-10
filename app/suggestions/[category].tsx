import { PookieColors } from '@/constants/Colors';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { AISuggestion } from '@/types/habit';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        return '#6366f1';
      case 'nutrition':
        return '#10b981';
      default:
        return PookieColors.hotPink;
    }
  };

  const handleAddHabit = async (suggestion: AISuggestion) => {
    try {
      // Use name as a unique identifier since id might not exist
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
        // Navigate to home tab after a short delay
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
      const { lineHeight } = e.nativeEvent;
      const maxLines = 3;
      const maxHeight = lineHeight * maxLines;
      const currentHeight = e.nativeEvent.lines.reduce((acc: number, line: any) => {
        return acc + line.height;
      }, 0);
      
      setShowReadMore(currentHeight > maxHeight);
    };

    return (
      <View key={`suggestion-${index}`} style={styles.suggestionCard}>
        <View style={styles.suggestionHeader}>
          <View style={[styles.suggestionIcon, { backgroundColor: `${categoryColor}20` }]}>
            <Ionicons name={iconName as any} size={20} color={categoryColor} />
          </View>
          <View style={styles.suggestionTitleContainer}>
            <Text style={styles.suggestionTitle}>{suggestion.name}</Text>
            <View style={styles.suggestionMetaContainer}>
              <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
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
            style={[styles.addButton, { backgroundColor: isAdding ? '#666' : categoryColor }]}
            onPress={() => !isAdding && handleAddHabit(suggestion)}
            disabled={isAdding}
          >
            {isAdding ? (
              <Ionicons name="time-outline" size={18} color="#fff" />
            ) : (
              <Ionicons name="add" size={18} color="#fff" />
            )}
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
        
        {suggestion.success_tips?.length > 0 && (
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

  if (!category) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No category selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {category.charAt(0).toUpperCase() + category.slice(1)} Suggestions
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {suggestions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="sad-outline" size={48} color="#666" />
            <Text style={styles.emptyStateText}>No suggestions found</Text>
          </View>
        ) : (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <SuggestionCard key={`suggestion-${index}`} suggestion={suggestion} index={index} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 40,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    marginRight: 16,
    color: '#000000ff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  suggestionsContainer: {
    paddingVertical: 20,
  },
  suggestionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionTitleContainer: {
    flex: 1,
  },
  suggestionTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    flex: 1,
    paddingRight: 8,
  },
  suggestionMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
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
  descriptionContainer: {
    padding: 16,
  },
  suggestionDescription: {
    color: '#000',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
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
    backgroundColor: '#fff',
    padding: 16,
    borderLeftWidth: 3,
    marginTop: 4,
  },
  tipBulletContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  tipBullet: {
    fontSize: 16,
    lineHeight: 16,
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
  tipText: {
    color: '#000',
    fontSize: 13,
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#000',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default CategorySuggestionsScreen;
