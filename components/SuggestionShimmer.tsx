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
    backgroundColor: "#ffffffff",
  },
  card: {
    backgroundColor: "#ffffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9c9c9cff',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    height: 20,
    width: '60%',
    backgroundColor: '#bdbdbdff',
    borderRadius: 4,
    marginBottom: 6,
  },
  subtitle: {
    height: 14,
    width: '40%',
    backgroundColor: '#ddddddff',
    borderRadius: 4,
  },
  description: {
    height: 16,
    backgroundColor: '#8f8f8fff',
    borderRadius: 4,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    height: 14,
    width: '30%',
    backgroundColor: '#d8d8d8ff',
    borderRadius: 4,
  },
  tipsContainer: {
    marginBottom: 16,
  },
  tipTitle: {
    height: 16,
    width: '30%',
    backgroundColor: '#ccccccff',
    borderRadius: 4,
    marginBottom: 8,
  },
  tip: {
    height: 12,
    backgroundColor: '#c9c9c9ff',
    borderRadius: 4,
    marginBottom: 4,
    width: '90%',
  },
  button: {
    height: 40,
    backgroundColor: '#c4c4c4ff',
    borderRadius: 8,
    marginTop: 8,
  },
});

export default SuggestionShimmer;
