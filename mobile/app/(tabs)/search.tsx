import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { MOCK_RECIPES } from '../data/mock-recipes';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Type for a recipe
  type Recipe = {
    id: string;
    name: string;
    ingredients: string;
    instructions: string;
    link?: string;
  };

  // Filter recipes by name, ingredients text, or instructions text
  const filteredRecipes = query 
    ? MOCK_RECIPES.filter((recipe: Recipe) =>
      recipe.name.toLowerCase().includes(query.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(query.toLowerCase()) || 
      recipe.instructions.toLowerCase().includes(query.toLowerCase())
    )
  : MOCK_RECIPES; // Show suggestions when no query is typed

  return (
    <View style={styles.container}>
      {/* Screen title */}
      <Text style={styles.title}>Search Recipes</Text>

      {/* Search input */}
      <TextInput
        placeholder="Search by name, ingredient, or instructions"
        placeholderTextColor="#999"
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />

      {/* List of filtered recipes*/}
      <FlatList
        data={filteredRecipes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }: { item: Recipe }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/recipe-detail',
                params: item, // pass recipe data to detail screen
              })
            }
          >
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeHint}>Tap to view recipe</Text> 
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* ======= STYLES ========= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // will support dark mode later
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    marginBottom: 16,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    color: Colors.light.text,
  },
  recipeHint: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
});
