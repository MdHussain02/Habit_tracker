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
              <View style={styles.subtitle} />
            </View>
          </View>
          <View style={styles.description} />
          <View style={styles.metaContainer}>
            <View style={styles.metaItem} />
            <View style={styles.metaItem} />
            <View style={styles.metaItem} />
          </View>
          <View style={styles.tipsContainer}>
            <View style={styles.tipTitle} />
            <View style={styles.tip} />
            <View style={styles.tip} />
          </View>
          <View style={styles.button} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#edf2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f4f8',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    height: 18,
    width: '60%',
    backgroundColor: '#f0f4f8',
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    height: 14,
    width: '40%',
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  description: {
    height: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    marginBottom: 20,
    width: '90%',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaItem: {
    height: 12,
    width: '28%',
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipTitle: {
    height: 14,
    width: '30%',
    backgroundColor: '#f0f4f8',
    borderRadius: 4,
    marginBottom: 12,
  },
  tip: {
    height: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    marginBottom: 8,
    width: '90%',
  },
  button: {
    height: 44,
    backgroundColor: '#f0f4f8',
    borderRadius: 12,
    marginTop: 12,
  },
});

export default SuggestionShimmer;
