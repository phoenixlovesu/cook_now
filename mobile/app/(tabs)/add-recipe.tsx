import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useRecipes } from '@/data/recipes-context';
import { Ingredient } from '@/data/mock-recipes';
import { lightTheme, darkTheme, Fonts } from '@/constants/theme';
import { useTheme, ThemeType } from '@/context/ThemeProvider';

export default function AddRecipeScreen() {
  const router = useRouter();
  const { addRecipe } = useRecipes();


    const { toggleTheme, isDark, theme } = useTheme();
    const styles = createStyles(theme);
  

  // Local state for form fields
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [link, setLink] = useState('');

  // Ref to move focus from name -> ingredients
  const ingredientsRef = useRef<TextInput>(null);

  /**
   * Save recipe into global context
   */
  const handleAddRecipe = () => {
    if (!name.trim() || !ingredients.trim() || !instructions.trim()) return;

    const ingredientList: Ingredient[] = ingredients
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(item => ({
        name: item,
        hasIt: false,
      }));

    addRecipe({
      name,
      ingredients: ingredientList,
      instructions,
      link,
    });

    // Reset form
    setName('');
    setIngredients('');
    setInstructions('');
    setLink('');

    router.push('/');
  };

  /**
   * Main screen content
   */
  const content = (
    <>
      <Text style={styles.title}>Add Recipe</Text>

      <Text style={styles.label}>Recipe Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Spaghetti Carbonara"
        placeholderTextColor={theme.textSecondary}
        value={name}
        onChangeText={setName}
        returnKeyType="next"
        onSubmitEditing={() => ingredientsRef.current?.focus()}
      />

      <Text style={styles.label}>Ingredients</Text>
      <TextInput
        ref={ingredientsRef}
        style={[styles.input, styles.multilineInput]}
        placeholder="One ingredient per line"
        placeholderTextColor={theme.textSecondary}
        multiline
        value={ingredients}
        onChangeText={setIngredients}
      />

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Step-by-step instructions"
        placeholderTextColor={theme.textSecondary}
        multiline
        value={instructions}
        onChangeText={setInstructions}
      />

      <Text style={styles.label}>Recipe Link (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="https://example.com/recipe"
        placeholderTextColor={theme.textSecondary}
        value={link}
        onChangeText={setLink}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddRecipe}>
        <Text style={styles.buttonText}>Add Recipe</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {Platform.OS !== 'web' ? (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
            >
              {content}
            </ScrollView>
          </TouchableWithoutFeedback>
        ) : (
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ===== Theme-aware styles ===== */
const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },

    container: {
      flexGrow: 1,
      paddingHorizontal: 24,
    },

    title: {
      fontSize: 28,
      fontWeight: '700',
      fontFamily: Fonts.sans,
      marginBottom: 24,
      color: theme.textPrimary,
    },

    label: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 6,
      color: theme.textPrimary,
    },

    input: {
      borderWidth: 1,
      borderColor: theme.divider,
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      marginBottom: 16,
      fontFamily: Fonts.sans,
      backgroundColor: theme.card,
      color: theme.textPrimary,
    },

    multilineInput: {
      height: 120,
      textAlignVertical: 'top',
    },

    button: {
      backgroundColor: theme.accent,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
    },

    buttonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
  });
