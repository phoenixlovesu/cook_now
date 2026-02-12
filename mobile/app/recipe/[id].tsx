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
import { useTheme, ThemeType } from '@/context/ThemeProvider';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecipeById, recipes, addRecipe } = useRecipes();

  // Find recipe either saved or in mock/API
  const recipe = getRecipeById(id || '');

  const { theme } = useTheme();
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
      {/* Recipe image if exists */}
      {recipe.image && (
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
        />
      )}

      {/* Recipe title */}
      <Text style={styles.title}>{recipe.name}</Text>

      {/* Ingredients list */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.ingredients
        // remove duplicates
        .filter(
          (ing, idx, self) =>
            self.findIndex(i => i.name === ing.name) === idx
        )
        .map((ing, index) => (
          <Text
            key={`${recipe.id}-${ing.name}-${index}`}
            style={styles.text}
          >
            - {ing.name}
          </Text>
        ))}

      {/* Instructions */}
      <Text style={styles.sectionTitle}>Instructions</Text>
      {recipe.instructions
        .split('\n')
        .filter(Boolean)
        .map((step, index) => (
          <Text
            key={`step-${index}`}
            style={styles.instructionText}
          >
            {step}
          </Text>
        ))}

      {/* Optional recipe link */}
      {recipe.link && (
        <TouchableOpacity
          onPress={() => Linking.openURL(recipe.link!)}
        >
          <Text style={styles.link}>View Recipe Online</Text>
        </TouchableOpacity>
      )}

      {/* Save button always visible, but tinted if already saved */}
      <TouchableOpacity
        style={[
          styles.button,
          isSaved && { backgroundColor: theme.buttonDisabled } // tint when saved
        ]}
        onPress={() => !isSaved && addRecipe(recipe)}
        activeOpacity={isSaved ? 1 : 0.7} // prevents press effect if already saved
      >
        <Text style={styles.buttonText}>
          {isSaved ? 'Recipe Saved' : 'Save Recipe'}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

/* ===== Theme-aware styles ===== */
const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      paddingBottom: 32,
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

    instructionText: {
      fontSize: 16,
      color: theme.textPrimary,
      fontFamily: Fonts.sans,
      marginBottom: 8, // space between steps
    },

    link: {
      fontSize: 16,
      color: theme.accent,
      marginTop: 12,
      fontFamily: Fonts.sans,
    },

    button: {
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 16,
      backgroundColor: theme.accent,

    },

    buttonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.sans,
    },
  });
