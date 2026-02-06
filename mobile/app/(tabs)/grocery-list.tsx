import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Grocery List screen- organized by recipe
 * Placeholder data for now, will later be dynamically generated
 */
export default function GroceryListScreen() {
  // Will eventually come from fridge + missing ingredients
  const groceryData = [
    {
      recipe: 'Spaghetti Carbonara',
      ingredients: ['Eggs', 'Parmesan', 'Pancetta'],
    },
    {
      recipe: 'Tomato Basil Soup',
      ingredients: ['Tomatoes', 'Basil', 'Vegetable Stock'],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Grocery List</Text>

      <FlatList
        data={groceryData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeName}>{item.recipe}</Text>
            {item.ingredients.map((ingredient, idx) => (
              <Text key={idx} style={styles.ingredientText}>
                • {ingredient}
              </Text>
            ))}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

/* ======== Styles ========== */
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
  recipeCard: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

