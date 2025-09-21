import colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApi } from '../../hooks/useApi';

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

export default function HabitDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [habit, setHabit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchGet } = useApi();
  const router = useRouter();

  useEffect(() => {
    const loadHabit = async () => {
      if (!id) {
        setError('No habit ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchGet(`/habits/${id}`);
        
        if (response.success && response.data) {
          // Handle both array and direct object responses
          const habitData = Array.isArray(response.data) ? response.data[0] : response.data;
          setHabit(habitData);
          setError(null);
        } else {
          setError(response.error || 'Failed to load habit details');
        }
      } catch (err) {
        console.error('Error loading habit:', err);
        setError('An error occurred while loading the habit');
      } finally {
        setLoading(false);
      }
    };

    loadHabit();
  }, [id, fetchGet]);

  const formatTime = (dateString: string | number | Date) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatRepeats = (days: number[]) => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && !days.includes(5) && !days.includes(6)) return 'Weekdays';
    if (days.length === 2 && days.includes(5) && days.includes(6)) return 'Weekends';
    
    return days.map(day => DAY_NAMES[day]).join(', ');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Habit Details</Text>
              <Text style={styles.headerDate}>View and manage your habit</Text>
            </View>
            
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.habitHeader}>
            <View style={styles.iconPlaceholder} />
            <View style={styles.titlePlaceholder} />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <View style={styles.detailLabelPlaceholder} />
              <View style={styles.detailValuePlaceholder} />
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailLabelPlaceholder} />
              <View style={styles.detailValuePlaceholder} />
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailLabelPlaceholder} />
              <View style={styles.detailValuePlaceholder} />
            </View>
          </View>
          <View style={styles.actionsContainer}>
            <View style={styles.actionButtonPlaceholder} />
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="warning-outline" size={48} color="#f87171" style={styles.errorIcon} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!habit) {
    return (
      <View style={styles.centered}>
        <Ionicons name="help-circle-outline" size={48} color="#9ca3af" style={styles.errorIcon} />
        <Text style={styles.emptyStateText}>Habit not found</Text>
        <Text style={styles.emptyStateSubtext}>The habit you're looking for doesn't exist or may have been deleted.</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const iconName = ICON_MAP[habit.icon_id] || 'help-circle';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>

        <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Habit Details</Text>
            <Text style={styles.headerDate}>View and manage your habit</Text>
          </View>
          
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.habitHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons 
              name={iconName as any} 
              size={48} 
              color={colors.primary} 
            />
          </View>
          <Text style={styles.habitName}>{habit.name}</Text>
          {habit.description && (
            <Text style={styles.habitDescription}>{habit.description}</Text>
          )}
        </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <Ionicons name="calendar-outline" size={20} color="#888" />
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Schedule</Text>
            <Text style={styles.detailValue}>
              {habit.repeats?.length ? 
                `Every ${habit.repeats.join(', ')}` : 
                'No specific schedule'}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailIcon}>
            <Ionicons name="time-outline" size={20} color="#888" />
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Target Time</Text>
            <Text style={styles.detailValue}>
              {habit.target_time ? formatTime(habit.target_time) : 'Not set'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => console.log('Toggle completion')}
        >
          <Ionicons 
            name={habit.completed ? 'close-circle-outline' : 'checkmark-circle-outline'} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.actionButtonText}>
            {habit.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    marginTop: 50,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  // Loading placeholders
  actionButtonPlaceholder: {
    width: 350,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  iconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  titlePlaceholder: {
    width: 200,
    height: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  detailLabelPlaceholder: {
    width: 100,
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 4,
  },
  detailValuePlaceholder: {
    width: 150,
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  // Habit details
  header: {
    backgroundColor: 'rgb(236, 74, 153)',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  habitName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  habitDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 16,
    color: '#666666',
    fontSize: 16,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  emptyStateText: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  habitTime: {
    fontSize: 16,
    color: '#888',
  },
  detailsContainer: {
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  actionsContainer: {
    padding: 16,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
