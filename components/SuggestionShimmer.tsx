import colors from '@/constants/Colors';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const SuggestionShimmer = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const ShimmerBlock = ({ style }: { style: any }) => (
    <Animated.View 
      style={[
        {
          backgroundColor: '#E1E5E9',
          opacity: shimmerOpacity,
        },
        style
      ]} 
    />
  );

  const renderSectionShimmer = () => (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionLeft}>
          <ShimmerBlock style={styles.sectionIcon} />
          <View>
            <ShimmerBlock style={styles.sectionTitle} />
            <ShimmerBlock style={styles.sectionSubtitle} />
          </View>
        </View>
        <ShimmerBlock style={styles.viewAllButton} />
      </View>
      
      {/* Single Card */}
      <View style={styles.suggestionCard}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <ShimmerBlock style={styles.cardIcon} />
          <View style={styles.cardTitleContainer}>
            <ShimmerBlock style={styles.cardTitle} />
            <View style={styles.tagsContainer}>
              <ShimmerBlock style={styles.tag} />
              <ShimmerBlock style={styles.tagSmall} />
            </View>
          </View>
        </View>
        
        {/* Description Lines */}
        <View style={styles.descriptionContainer}>
          <ShimmerBlock style={[styles.descriptionLine, { width: '100%' }]} />
          <ShimmerBlock style={[styles.descriptionLine, { width: '90%' }]} />
          <ShimmerBlock style={[styles.descriptionLine, { width: '75%' }]} />
        </View>
        
        {/* Meta Row */}
        <View style={styles.metaRow}>
          <ShimmerBlock style={styles.metaItem} />
          <ShimmerBlock style={styles.metaItem} />
          <ShimmerBlock style={styles.metaItem} />
        </View>
        
        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <ShimmerBlock style={styles.tipsTitle} />
          <View style={styles.tipRow}>
            <ShimmerBlock style={styles.tipBullet} />
            <ShimmerBlock style={styles.tipLine} />
          </View>
          <View style={styles.tipRow}>
            <ShimmerBlock style={styles.tipBullet} />
            <ShimmerBlock style={[styles.tipLine, { width: '80%' }]} />
          </View>
        </View>

        {/* Add Button */}
        <ShimmerBlock style={styles.addButton} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderSectionShimmer()}
      {renderSectionShimmer()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
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
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sectionTitle: {
    width: 80,
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  sectionSubtitle: {
    width: 120,
    height: 14,
    borderRadius: 3,
  },
  viewAllButton: {
    width: 60,
    height: 28,
    borderRadius: 14,
  },
  suggestionCard: {
    backgroundColor: colors['bg-accent'],
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    width: '70%',
    height: 18,
    borderRadius: 4,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    width: 60,
    height: 16,
    borderRadius: 12,
  },
  tagSmall: {
    width: 45,
    height: 16,
    borderRadius: 12,
  },
  descriptionContainer: {
    marginBottom: 16,
    gap: 6,
  },
  descriptionLine: {
    height: 14,
    borderRadius: 3,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors['bg-secondary'],
    borderRadius: 16,
    marginBottom: 16,
  },
  metaItem: {
    width: 50,
    height: 12,
    borderRadius: 3,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipsTitle: {
    width: 80,
    height: 16,
    borderRadius: 4,
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipBullet: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  tipLine: {
    flex: 1,
    height: 12,
    borderRadius: 3,
  },
  addButton: {
    height: 48,
    borderRadius: 16,
  },
});

export default SuggestionShimmer;