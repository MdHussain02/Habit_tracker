import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const SuggestionShimmer = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.card}>
          <View style={styles.header}>
            <View style={styles.icon} />
            <View style={styles.titleContainer}>
              <View style={styles.title} />
              <View style={styles.metaContainer}>
                <View style={styles.metaItem} />
                <View style={styles.metaItem} />
              </View>
            </View>
            <View style={styles.addButton} />
          </View>
          <View style={styles.descriptionContainer}>
            <View style={styles.description} />
            <View style={[styles.description, {width: '80%'}]} />
          </View>
          <View style={styles.suggestionMeta}>
            <View style={styles.metaItem} />
            <View style={styles.metaItem} />
            <View style={styles.metaItem} />
          </View>
          <View style={styles.tipsContainer}>
            <View style={styles.tipTitle} />
            <View style={styles.tip}>
              <View style={styles.tipBullet} />
              <View style={styles.tipText} />
            </View>
            <View style={styles.tip}>
              <View style={styles.tipBullet} />
              <View style={styles.tipText} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 0,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    height: 15,
    width: '60%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    height: 12,
    width: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginLeft: 'auto',
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  description: {
    height: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  suggestionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  tipsContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(0,0,0,0.1)',
    marginTop: 4,
  },
  tipTitle: {
    height: 14,
    width: 100,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginBottom: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 8,
  },
  tipText: {
    height: 12,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
  },
});

export default SuggestionShimmer;
