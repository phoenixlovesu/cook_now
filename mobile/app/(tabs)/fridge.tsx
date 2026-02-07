import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useRecipes } from '@/data/recipes-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function FridgeScreen() {
  const router = useRouter();
  const { suggestRecipes } = useRecipes();
  const fridgeItems = ['tomatoes', 'chicken', 'bread']; // Example fridge items

  const suggestedRecipes = suggestRecipes(fridgeItems);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {suggestedRecipes.length === 0 ? (
          <Text style={styles.emptyText}>No matching recipes in your fridge.</Text>
        ) : (
          <FlatList
            data={suggestedRecipes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  // Go to detail page before saving
                  router.push({
                    pathname: '/recipe/[id]',
                    params: { id: item.id },
                  })
                }
              >
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                  />
                )}
                <Text style={styles.cardTitle}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16 },
  card: {
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 32,
    fontStyle: 'italic',
  },
});

