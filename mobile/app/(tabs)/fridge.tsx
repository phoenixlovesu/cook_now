import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecipes, Recipe } from '@/data/recipes-context';
import { router } from 'expo-router';
import { MOCK_RECIPES } from '@/data/mock-recipes';

export default function FridgeScreen() {
  // {const { suggestRecipes } = useRecipes();} - maybe use this later to accept both fridge items & recipe source (mock + API)

  const [fridgeItems, setFridgeItems] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // Add ingredient to fridge list
  const handleAddIngredient = () => {
    const ingredient = input.trim().toLowerCase();
    if (ingredient && !fridgeItems.includes(ingredient)) {
      setFridgeItems(prev => [...prev, ingredient]);
    }
    setInput('');
    //Keyboard.dismiss();
  };

  // Get suggested recipes based on fridge items
  // recipes with more matching ingredients float to the top
  const recipesToShow: Recipe[] = fridgeItems.length
   ? MOCK_RECIPES
      .map(recipe => {
        const matchCount = recipe.ingredients.filter(ingredient =>
          fridgeItems.some(item =>
            ingredient.name.toLowerCase().includes(item.toLowerCase())
          )
        ).length;

        return { recipe, matchCount };
      })
      .filter(r => r.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .map(r => r.recipe)
  : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* Screen title */}
            <Text style={styles.title}>What's in My Fridge</Text>

            {/* Input + add button */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Add ingredient..."
                placeholderTextColor="#999"
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleAddIngredient}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddIngredient}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Show fridge items as chips */}
            {fridgeItems.length > 0 && (
              <View style={styles.chipsContainer}>
                {fridgeItems.map(item => (
                  <View key={item} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Recipes grid or empty state */}
            {recipesToShow.length === 0 ? (
              <Text style={styles.emptyText}>
                {fridgeItems.length === 0
                  ? 'Add ingredients to see recipes you can make.'
                  : 'No recipes match these ingredients.'}
              </Text>
            ) : (
              <FlatList
                data={recipesToShow}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => {
                      router.push({ pathname: '/recipe/[id]', params: { id: item.id } })
                    }}
                  >
                {/* Image container (always reserve space) */}
                <View style={styles.cardImageContainer}>
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.cardImage}
                    />
                  ) : (
                    <View style={styles.cardImagePlaceholder} />
                  )}
                </View>

                {/* Title at bottom */}
                <Text style={styles.cardTitle}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ======== Styles ============ */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
  },

  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },

  addButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },

  chip: {
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    fontSize: 14,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#999',
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  card: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    alignItems: 'center',
  },

  cardImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee', // placeholder background
  },

  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 8,
    textAlign: 'center',
  },
});

