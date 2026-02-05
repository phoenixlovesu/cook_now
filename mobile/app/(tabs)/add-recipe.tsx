import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { useState } from 'react';

export default function AddRecipeScreen() {
    const router = useRouter();

    // Local state to track form inputs
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [link, setLink] = useState(''); 

    const handleAddRecipe = () => {
        console.log('Recipe:', { name, ingredients, instructions, link });
        // navigate back to RecipeDetailScreen
        router.push('/recipe-detail');
    };

  return (
    <View style={styles.container}>
      
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
        placeholder="List ingredients, one per line"
        placeholderTextColor="#999"
        style={[styles.input, styles.multilineInput]}
        multiline
        value={ingredients}
        onChangeText={setIngredients}
      />

      {/* Instructions input */}
      <Text style={styles.label}>Instructions</Text>
      <TextInput
        placeholder="Describe how to make the recipe"
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
    </View>
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
