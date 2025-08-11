import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationHistoryItem } from '../types/notification';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface NotificationHistoryProps {
  maxItems?: number;
  showRead?: boolean;
}

export function NotificationHistory({ 
  maxItems = 50, 
  showRead = true 
}: NotificationHistoryProps) {
  const { notificationHistory, markAsRead, loadNotificationHistory, loading } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  const filteredHistory = (notificationHistory || [])
    .filter(item => showRead || !item.read)
    .slice(0, maxItems);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadNotificationHistory();
    } catch (error) {
      console.error('Error refreshing notification history:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (notification: NotificationHistoryItem) => {
    try {
      const success = await markAsRead(notification.id);
      if (!success) {
        Alert.alert('Error', 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: NotificationHistoryItem['type']) => {
    switch (type) {
      case 'habit_reminder':
        return 'time';
      case 'streak_notification':
        return 'flame';
      case 'ai_suggestion':
        return 'bulb';
      case 'progress_report':
        return 'analytics';
      case 'motivation':
        return 'heart';
      case 'milestone':
        return 'trophy';
      case 'daily_digest':
        return 'calendar';
      case 'weekly_report':
        return 'bar-chart';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: NotificationHistoryItem['type']) => {
    switch (type) {
      case 'habit_reminder':
        return '#34C759';
      case 'streak_notification':
        return '#FF9500';
      case 'ai_suggestion':
        return '#AF52DE';
      case 'progress_report':
        return '#007AFF';
      case 'motivation':
        return '#FF3B30';
      case 'milestone':
        return '#FFD700';
      case 'daily_digest':
        return '#5856D6';
      case 'weekly_report':
        return '#5AC8FA';
      default:
        return '#8E8E93';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return new Date(timestamp).toLocaleDateString();
    }
  };

  const renderNotificationItem = ({ item }: { item: NotificationHistoryItem }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification,
      ]}
      onPress={() => handleMarkAsRead(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={20}
            color={getNotificationColor(item.type)}
          />
        </View>
        <View style={styles.notificationContent}>
          <ThemedText style={styles.notificationTitle} numberOfLines={2}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.notificationMessage} numberOfLines={3}>
            {item.message}
          </ThemedText>
        </View>
        <View style={styles.notificationMeta}>
          <ThemedText style={styles.timestamp}>
            {formatTimestamp(item.timestamp)}
          </ThemedText>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-off" size={48} color="#8E8E93" />
      <ThemedText style={styles.emptyStateTitle}>No Notifications</ThemedText>
      <ThemedText style={styles.emptyStateMessage}>
        {showRead 
          ? 'You haven\'t received any notifications yet.'
          : 'You have no unread notifications.'
        }
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredHistory}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
  notificationItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  unreadNotification: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationMessage: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
  },
  notificationMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
}); 