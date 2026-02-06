import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import {Colors, Fonts } from '@/constants/theme';
import { useRecipes } from '@/app/data/recipes-context'
import { SafeAreaView } from 'react-native-safe-area-context';

// Type for a recipe
type Recipe = {
  name: string;
  ingredients: string;
  instructions: string;
  link?: string;
}

export default function HomeScreen() {
  const router = useRouter();

  // Get recipes from context
  const { recipes } = useRecipes();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Recipes</Text>

      {/* Show empty state if no recipes */}
      {recipes.length === 0 ? (
        <View style={styles.empty}> 
          <Text style={styles.emptyText}>You have no recipes yet</Text>
          <Text style={styles.emptyHint}>Add a recipe to start cooking and planning meals.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/add-recipe')} // go to Add Recipe screen
            >
              <Text style={styles.buttonText}>Add recipe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // renders a scrollable list of recipe cards
        <FlatList
          data={recipes} 
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.recipeCard}
              onPress={() => 
                router.push({
                  pathname: '/recipe-detail',
                  params: {
                    name: item.name,
                    ingredients: item.ingredients,
                    instructions: item.instructions,
                    link: item.link,
                  },
                })
              }
            >
              {/* recipe title */}
              <Text style={styles.recipeName}>{item.name}</Text>

              {/* Ingredients snippet */}
              <Text style={styles.recipeSnippet}>
                {/* Show first 3 ingredients */}
                {item.ingredients.split(',').slice(0.3).join(',')}
              </Text>
            </TouchableOpacity>
          )}
          />
        )}
    </SafeAreaView>
  );
}

/* ====== STYLES ============ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    marginBottom: 24,
    color: Colors.light.text
  },
  empty: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 20,
  },
  emptyHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: Colors.light.background,
    fontWeight: '600',
    fontSize: 16,
  },
  recipeCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  recipeSnippet: {
    fontSize: 14,
    color: '#666'
  },
});
