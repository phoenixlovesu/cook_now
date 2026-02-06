import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

export default function AddRecipeScreen() {
    const router = useRouter();

    // Local state to track form inputs
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [link, setLink] = useState(''); 

    // called when user taps Add Recipe
    const handleAddRecipe = () => {
        console.log('Recipe:', { name, ingredients, instructions, link });

        // TODO: save recipe to local state / backend here 

        // navigate back to RecipeDetailScreen with entered data
        router.push({
          pathname: '/recipe-detail',
          params: { name, ingredients, instructions, link }
        });
      };

  return (
    // Moves UI up when keyboard is visble
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding': 'height'}
    >
      {/* Dismiss keyboard when user taps outside inputs */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
        {/* Screen title */}
        <Text style={styles.title}>Add Recipe</Text>

        {/* Recipe name input */}
        <Text style={styles.label}>Recipe Name</Text>
        <TextInput
          placeholder="e.g. Spaghetti Carbonara"
          placeholderTextColor="#999"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        {/* Ingredients input */}
        <Text style={styles.label}>Ingredients</Text>
        <TextInput
          placeholder="One ingredient per line"
          placeholderTextColor="#999"
          style={[styles.input, styles.multilineInput]}
          multiline
          value={ingredients}
          onChangeText={setIngredients}
        />

        {/* Instructions input */}
        <Text style={styles.label}>Instructions</Text>
        <TextInput
          placeholder="Step-by-step instructions"
          placeholderTextColor="#999"
          style={[styles.input, styles.multilineInput]}
          multiline
          value={instructions}
          onChangeText={setInstructions} 
        />

        {/* Recipe link input (optional) */}
        <Text style={styles.label}>Recipe Link (optional)</Text>
        <TextInput
          placeholder="https://example.com/recipe"
          placeholderTextColor="#999"
          style={styles.input}
          value={link}
          onChangeText={setLink}
        />

        {/* Save button (no logic yet) */}
        <TouchableOpacity style={styles.button} onPress={handleAddRecipe}>
          <Text style={styles.buttonText}>Add Recipe</Text>
        </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView> 
  );
}

/* ============= STYLES ========== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 40,
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
    textAlignVertical: 'top', // keeps text at top on android
  },

  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
