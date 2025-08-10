import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PookieColors } from '@/constants/Colors';
import { AISuggestion } from '@/types/habit';

const CategorySuggestionsScreen = () => {
  const { category, suggestions: suggestionsString } = useLocalSearchParams<{
    category: string;
    suggestions: string;
  }>();
  
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const router = useRouter();

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
    switch (category.toLowerCase()) {
      case 'fitness':
        return '#6366f1';
      case 'nutrition':
        return '#10b981';
      default:
        return PookieColors.hotPink;
    }
  };

  const SuggestionCard = ({ suggestion, index }: { suggestion: AISuggestion, index: number }) => {
    const [expanded, setExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const iconName = {
      'fitness': 'fitness',
      'nutrition': 'nutrition',
      'general': 'bulb-outline'
    }[suggestion.category.toLowerCase()] || 'help-circle';

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
          <View style={[styles.suggestionIcon, { backgroundColor: getCategoryColor(suggestion.category) }]}>
            <Ionicons name={iconName as any} size={24} color="#fff" />
          </View>
          <View style={styles.suggestionTitleContainer}>
            <Text style={styles.suggestionTitle}>{suggestion.name}</Text>
            <Text style={styles.suggestionCategory}>
              {suggestion.category} • {suggestion.difficulty}
            </Text>
          </View>
        </View>
        
        <View>
          <Text 
            style={styles.suggestionDescription} 
            numberOfLines={expanded ? undefined : 3}
            onTextLayout={onTextLayout}
          >
            {suggestion.description}
          </Text>
          {showReadMore && (
            <TouchableOpacity onPress={toggleExpand} style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>
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
          <Ionicons name="arrow-back" size={24} color="#fff" />
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
    flex: 1,
    backgroundColor: '#14141c',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a35',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  suggestionsContainer: {
    paddingVertical: 20,
  },
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
  suggestionDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: PookieColors.hotPink,
    fontSize: 14,
    fontWeight: '500',
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#14141c',
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
    color: '#888',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default CategorySuggestionsScreen;
