import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Colors, Fonts } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Fridge screen lets users add ingredients they currently have
 * Will connect this to recipe recommendations and missing ingredients later
 */
export default function FridgeScreen() {
  const [ingredient, setIngredient] = useState('');
  const [fridgeItems, setFridgeItems] = useState<string[]>([]);

  // Adds ingredient to fridge list
  const handleAddIngredient = () => {
    if (!ingredient.trim()) return;
    setFridgeItems(prev => [...prev, ingredient.trim()]);
    setIngredient('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Fridge</Text>

      {/* Input field for fridge ingredients */}
      <TextInput
        style={styles.input}
        placeholder="Add ingredient you have"
        placeholderTextColor="#999"
        value={ingredient}
        onChangeText={setIngredient}
        onSubmitEditing={handleAddIngredient} // press Enter to add
        returnKeyType="done"
      />

      {/* Add button */}
      <TouchableOpacity style={styles.button} onPress={handleAddIngredient}>
        <Text style={styles.buttonText}>Add Ingredient</Text>
      </TouchableOpacity>

      {/* List of ingredients in fridge */}
      <FlatList
        data={fridgeItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No ingredients yet</Text>}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

/* ====== Styles ======== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    marginBottom: 16,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: Colors.light.background,
    fontWeight: '600',
    fontSize: 16,
  },
  itemCard: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 16,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
