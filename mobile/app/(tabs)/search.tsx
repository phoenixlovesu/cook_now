import React, { useState, useEffect } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeImage from '@/components/ui/recipe-image';
import { useTheme, ThemeType } from '@/context/ThemeProvider';
import { useRecipes } from '@/data/recipes-context';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const { theme } = useTheme();
  const styles = createStyles(theme);

  const { fetchRecipesFromAPI, apiRecipes } = useRecipes();

  // Fetch API recipes on mount
  useEffect(() => {
    fetchRecipesFromAPI('');
  }, []);

  // Combine mock recipes + API recipes only
  const allSearchableRecipes: Recipe[] = [
    ...MOCK_RECIPES,
    ...apiRecipes,
  ];

  // Filter based on search input
  const filteredRecipes: Recipe[] = allSearchableRecipes.filter(recipe => {
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
        <Text style={styles.title}>Discover Recipes</Text>

        {/* Search input */}
        <TextInput
          style={styles.input}
          placeholder="Search recipes or ingredients"
          placeholderTextColor={theme.textSecondary}
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
                {/* Image container */}
                <View style={styles.cardImageContainer}>
                  <RecipeImage uri={item.image} style={styles.cardImage} />
                </View>

                {/* Recipe title */}
                <Text style={styles.cardTitle}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* ===== Styles (one property per line) ===== */
const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
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
      marginBottom: 16,
      color: theme.textPrimary,
      fontFamily: 'sans-serif',
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      marginBottom: 16,
      color: theme.textPrimary,
      backgroundColor: theme.card,
      fontFamily: 'sans-serif',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 24,
      fontSize: 16,
      color: theme.textSecondary,
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
      backgroundColor: theme.card,
    },
    cardImageContainer: {
      width: '100%',
      height: 120,
      backgroundColor: theme.divider,
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
      color: theme.textPrimary,
      fontFamily: 'sans-serif',
    },
  });
