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
import { Colors, Fonts } from '@/constants/theme';
import { useRecipes } from '@/data/recipes-context';
import { Ingredient } from '@/data/mock-recipes';

export default function AddRecipeScreen() {
  const router = useRouter();
  const { addRecipe } = useRecipes();

  // Local state for form fields
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [link, setLink] = useState('');

  // Ref to move focus from name -> ingredients
  const ingredientsRef = useRef<TextInput>(null);

  /* ===== Handler to save recipe ===== */
  const handleAddRecipe = () => {
    // Prevent saving if required fields are empty
    if (!name.trim() || !ingredients.trim() || !instructions.trim()) return;

    // Convert ingredients string into array of Ingredient objects
    const ingredientList: Ingredient[] = ingredients
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(item => ({
        name: item,
        hasIt: false,
      }));

    // Save recipe to context
    addRecipe({
      name,
      ingredients: ingredientList,
      instructions,
      link,
    });

    // Reset form fields after saving
    setName('');
    setIngredients('');
    setInstructions('');
    setLink('');

    // Navigate back to home screen
    router.push('/');
  };

  /* ===== Content JSX ===== */
  const content = (
    <>
      {/* Screen title */}
      <Text style={styles.title}>Add Recipe</Text>

      {/* Recipe Name */}
      <Text style={styles.label}>Recipe Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Spaghetti Carbonara"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        returnKeyType="next"
        onSubmitEditing={() => ingredientsRef.current?.focus()}
      />

      {/* Ingredients */}
      <Text style={styles.label}>Ingredients</Text>
      <TextInput
        ref={ingredientsRef}
        style={[styles.input, styles.multilineInput]}
        placeholder="One ingredient per line"
        placeholderTextColor="#999"
        multiline
        value={ingredients}
        onChangeText={setIngredients}
      />

      {/* Instructions */}
      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Step-by-step instructions"
        placeholderTextColor="#999"
        multiline
        value={instructions}
        onChangeText={setInstructions}
      />

      {/* Optional link */}
      <Text style={styles.label}>Recipe Link (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="https://example.com/recipe"
        placeholderTextColor="#999"
        value={link}
        onChangeText={setLink}
      />

      {/* Save button */}
      <TouchableOpacity style={styles.button} onPress={handleAddRecipe}>
        <Text style={styles.buttonText}>Add Recipe</Text>
      </TouchableOpacity>
    </>
  );

  /* ===== Render ===== */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
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

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    marginBottom: 24,
    color: Colors.light.text,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: Colors.light.text,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    fontFamily: Fonts.sans,
    backgroundColor: '#fff',
  },

  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
