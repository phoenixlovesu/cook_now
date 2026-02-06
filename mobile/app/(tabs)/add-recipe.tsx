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
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecipes } from '@/app/data/recipes-context';

export default function AddRecipeScreen() {
  const router = useRouter();
  const { addRecipe } = useRecipes(); // Access global recipe state

  // Local form state
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [link, setLink] = useState('');

  // Ref used to move focus from name → ingredients
  const ingredientsRef = useRef<TextInput>(null);

  const handleAddRecipe = () => {
    // Prevent empty recipes from being saved
    if (!name.trim() || !ingredients.trim() || !instructions.trim()) return;

    // Save recipe to global context so it appears on Home
    addRecipe({ name, ingredients, instructions, link });

    // Reset form fields
    setName('');
    setIngredients('');
    setInstructions('');
    setLink('');

    // Navigate back to Home screen
    router.push('/');
  };

  // Extracted screen content so it can be reused
  // for both web and mobile wrappers
  const content = (
    <>
      {/* Screen title */}
      <Text style={styles.title}>Add Recipe</Text>

      {/* Recipe name input */}
      <Text style={styles.label}>Recipe Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Spaghetti Carbonara"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        returnKeyType="next"
        // Move focus to ingredients when user presses "Next"
        onSubmitEditing={() => ingredientsRef.current?.focus()}
      />

      {/* Ingredients input */}
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

      {/* Instructions input */}
      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Step-by-step instructions"
        placeholderTextColor="#999"
        multiline
        value={instructions}
        onChangeText={setInstructions}
      />

      {/* Optional recipe link */}
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

  /* ======= Render ======== */
  return (
    // Ensures content does not overlap with notch / dynamic island
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      
      {/* Adjusts layout when keyboard appears */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {Platform.OS !== 'web' ? (
          // Mobile - allow tapping outside inputs to dismiss keyboard
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
            >
              {content}
            </ScrollView>
          </TouchableWithoutFeedback>
        ) : (
          // Web - TouchableWithoutFeedback breaks typing so it is skipped here
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


/* ======== Styles ============ */
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
