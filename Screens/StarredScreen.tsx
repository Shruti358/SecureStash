import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TopNavbar from '../components/TopNavbar';

interface StarredScreenProps {
  navigation: any;
}

const StarredScreen: React.FC<StarredScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TopNavbar navigation={navigation} />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Starred Files</Text>
        <Text style={styles.subtitle}>Files and folders you've starred will appear here</Text>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No starred files yet</Text>
          <Text style={styles.emptySubtext}>
            Star important files to quickly access them later
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default StarredScreen;