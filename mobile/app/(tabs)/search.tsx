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
  const filteredRecipes = MOCK_RECIPES.filter(recipe => {
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
                {/* Optional image */}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
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
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});
