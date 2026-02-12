import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_RECIPES, Recipe } from '@/data/mock-recipes';
import { lightTheme, darkTheme, Fonts } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeImage from '@/components/ui/recipe-image';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const colorScheme = useColorScheme() ?? 'light';
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  // Filter mock recipes based on search query (name or ingredient)
  const filteredRecipes: Recipe[] = MOCK_RECIPES.filter(recipe => {
    const q = query.toLowerCase();
    return (
      recipe.name.toLowerCase().includes(q) ||
      recipe.ingredients.some(i => i.name.toLowerCase().includes(q))
    );
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        {/* Screen title */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Discover Recipes
        </Text>

        {/* Search input */}
        <TextInput
          style={[styles.input, { borderColor: theme.divider, color: theme.textPrimary, backgroundColor: theme.card }]}
          placeholder="Search recipes or ingredients"
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={setQuery}
        />

        {/* Show filtered results or empty state */}
        {filteredRecipes.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No recipes found.
          </Text>
        ) : (
          <FlatList
            data={filteredRecipes}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.card }]}
                onPress={() =>
                  router.push({
                    pathname: '/recipe/[id]',
                    params: { id: item.id },
                  })
                }
              >
                {/* Image container (always reserve space) */}
                <View style={[styles.cardImageContainer, { backgroundColor: theme.divider }]}>
                  <RecipeImage uri={item.image} style={styles.cardImage} />
                </View>

                {/* Title at bottom */}
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                  {item.name}
                </Text>
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
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    fontFamily: Fonts.sans,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  card: {
    flex: 1,
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    alignItems: 'center',
  },

  cardImageContainer: {
    width: '100%',
    height: 120,
  },

  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 8,
    textAlign: 'center',
  },
});


