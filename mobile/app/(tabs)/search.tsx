import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_RECIPES, Recipe } from '@/data/mock-recipes';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Filter mock recipes based on search query (name or ingredient)
  const filteredRecipes: Recipe[] = MOCK_RECIPES.filter(recipe => {
    const q = query.toLowerCase();
    return (
      recipe.name.toLowerCase().includes(q) ||
      recipe.ingredients.some(i => i.name.toLowerCase().includes(q))
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Search input */}
        <TextInput
          style={styles.input}
          placeholder="Search recipes or ingredients"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />

        {/* Show filtered results or empty state */}
        {filteredRecipes.length === 0 ? (
          <Text style={styles.emptyText}>No recipes found.</Text>
        ) : (
          <FlatList
            data={filteredRecipes}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: '/recipe/[id]',
                    params: { id: item.id },
                  })
                }
              >
                {/* Image container (always reserve space) */}
                <View style={styles.cardImageContainer}>
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.cardImage}
                    />
                  ) : (
                    <View style={styles.cardImagePlaceholder} />
                  )}
                </View>

                {/* Title at bottom */}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#999',
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  card: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    alignItems: 'center',
  },

  cardImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee', // placeholder background
  },

  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 8,
    textAlign: 'center',
  },
});

