import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRecipes } from '@/data/recipes-context';
import { lightTheme, darkTheme, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecipeById, recipes, addRecipe } = useRecipes();

  // Find recipe either saved or in mock
  const recipe = getRecipeById(id || '');

  // Resolve theme
  const colorScheme = useColorScheme() ?? 'light';
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = createStyles(theme);

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.textPrimary }}>Recipe not found.</Text>
      </View>
    );
  }

  // Check if recipe is already saved
  const isSaved = recipes.some(r => r.id === recipe.id);

  return (
    <ScrollView style={styles.container}>
      {/* Optional recipe image */}
      {recipe.image && (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      )}

      <Text style={styles.title}>{recipe.name}</Text>

      {/* Ingredients */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.ingredients.map(ing => (
        <Text key={ing.name} style={styles.text}>
          - {ing.name}
        </Text>
      ))}

      {/* Instructions */}
      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.text}>{recipe.instructions}</Text>

      {/* Recipe Link */}
      {recipe.link && (
        <TouchableOpacity onPress={() => Linking.openURL(recipe.link!)}>
          <Text style={styles.link}>View Recipe Online</Text>
        </TouchableOpacity>
      )}

      {/* Save button if not already saved */}
      {!isSaved && (
        <TouchableOpacity style={styles.button} onPress={() => addRecipe(recipe)}>
          <Text style={styles.buttonText}>Save Recipe</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

/* ===== Theme-aware styles ===== */
const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.background,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 16,
      color: theme.textPrimary,
      fontFamily: Fonts.sans,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 12,
      marginBottom: 8,
      color: theme.textPrimary,
      fontFamily: Fonts.sans,
    },
    text: {
      fontSize: 16,
      marginBottom: 4,
      color: theme.textPrimary,
      fontFamily: Fonts.sans,
    },
    link: {
      fontSize: 16,
      color: theme.accent,
      marginTop: 12,
      fontFamily: Fonts.sans,
    },
    button: {
      backgroundColor: theme.accent,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.sans,
    },
  });

