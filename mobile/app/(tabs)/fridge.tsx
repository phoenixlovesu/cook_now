import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MOCK_RECIPES, Recipe } from '@/data/mock-recipes';

export default function FridgeScreen() {
  const router = useRouter();

  // Stores ingredients the user says they have
  const [fridgeInput, setFridgeInput] = useState('');
  const [fridgeItems, setFridgeItems] = useState<string[]>([]);

  /**
   * Add ingredient to fridge list
   * - trims whitespace
   * - avoids empty strings
   * - avoids duplicates
   */
  const addIngredient = () => {
    const value = fridgeInput.trim().toLowerCase();

    if (!value) return;
    if (fridgeItems.includes(value)) return;

    setFridgeItems(prev => [...prev, value]);
    setFridgeInput('');
  };

  /**
   * Filter recipes:
   * A recipe is included if it matches
   * at least ONE ingredient from the fridge
   */
  const suggestedRecipes: Recipe[] = useMemo(() => {
    if (fridgeItems.length === 0) {
      return [];
    }

    return MOCK_RECIPES.filter(recipe =>
      recipe.ingredients.some(ingredient =>
        fridgeItems.includes(ingredient.name.toLowerCase())
      )
    );
  }, [fridgeItems]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Screen title */}
        <Text style={styles.title}>What’s in my fridge?</Text>

        {/* Ingredient input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add an ingredient (e.g. eggs)"
            value={fridgeInput}
            onChangeText={setFridgeInput}
            onSubmitEditing={addIngredient}
            returnKeyType="done"
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={addIngredient}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Show entered ingredients */}
        {fridgeItems.length > 0 && (
          <Text style={styles.fridgeItemsText}>
            You have: {fridgeItems.join(', ')}
          </Text>
        )}

        {/* Section title */}
        <Text style={styles.sectionTitle}>Recipes you can make</Text>

        {/* Empty state */}
        {suggestedRecipes.length === 0 ? (
          <Text style={styles.emptyText}>
            Add ingredients to see recipe suggestions.
          </Text>
        ) : (
          <FlatList
            data={suggestedRecipes}
            keyExtractor={item => item.id}
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
                <Text style={styles.cardTitle}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* --------- STYLES ---------*/
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
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
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  fridgeItemsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginTop: 12,
  },
  card: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});


