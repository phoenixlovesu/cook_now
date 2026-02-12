import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_RECIPES, Recipe } from '@/data/mock-recipes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ThemeType } from '@/context/ThemeProvider';
import { useRecipes } from '@/data/recipes-context';
import RecipeImage from '@/components/ui/recipe-image';

export default function FridgeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const { apiRecipes } = useRecipes();

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // Combine mock + API recipes (exclude user-added)
  const allRecipes: Recipe[] = [...MOCK_RECIPES, ...apiRecipes];

  // Suggest recipes based on current ingredient chips
  const suggestedRecipes: Recipe[] = allRecipes.filter(recipe =>
    ingredients.some(ing =>
      recipe.ingredients.some(rIng => rIng.name.toLowerCase().includes(ing.toLowerCase()))
    )
  );

  // Add ingredient chip
  const addIngredient = () => {
    if (input.trim() !== '' && !ingredients.includes(input.trim())) {
      setIngredients(prev => [...prev, input.trim()]);
      setInput('');
    }
  };

  // Remove ingredient chip
  const removeIngredient = (name: string) => {
    setIngredients(prev => prev.filter(i => i !== name));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        {/* Screen title */}
        <Text style={styles.title}>Your Fridge</Text>

        {/* Ingredient input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add ingredient"
            placeholderTextColor={theme.textSecondary}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Ingredient chips */}
        <View style={styles.chipsContainer}>
          {ingredients.map(ing => (
            <TouchableOpacity
              key={ing}
              style={styles.chip}
              onPress={() => removeIngredient(ing)}
            >
              <Text style={styles.chipText}>{ing} ×</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Suggestions */}
        {ingredients.length === 0 ? (
          <Text style={styles.emptyText}>Add ingredients to get recipe suggestions.</Text>
        ) : suggestedRecipes.length === 0 ? (
          <Text style={styles.emptyText}>No recipes found.</Text>
        ) : (
          <FlatList
            data={suggestedRecipes}
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
                <View style={styles.cardImageContainer}>
                  <RecipeImage uri={item.image} style={styles.cardImage} />
                </View>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* ===== Styles ===== */
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
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: theme.textPrimary,
      backgroundColor: theme.card,
      fontFamily: 'sans-serif',
    },
    addButton: {
      marginLeft: 8,
      backgroundColor: theme.accent,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: {
      color: theme.buttonText,
      fontWeight: '600',
      fontSize: 16,
      fontFamily: 'sans-serif',
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    chip: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.divider,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      marginBottom: 8,
    },
    chipText: {
      color: theme.textPrimary,
      fontSize: 14,
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
