import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import {Colors, Fonts } from '@/constants/theme';

// Type for a recipe
type Recipe = {
  name: string;
  ingredients: string;
  instructions: string;
  link?: string;
}

// initial mock recipes 
const initialRecipes: Recipe[] = [
  {
    name: 'Spaghetti Carbonara',
    ingredients: 'Spaghetti, Eggs, Pancetta, Parmesan, Pepper',
    instructions: 'Cook pasta. Mix eggs and cheese. Fry pancetta. Combine all.',
    link: 'https://example.com/carbonara',
  },
  {
    name: 'Tomato Basil Soup',
    ingredients: 'Tomatoes, Basil, Onion, Garlic, Vegetable Stock',
    instructions: 'Cook all ingredients. Blend until smooth. Serve warm.',
    link: 'https://example.com/tomato-soup',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const recipes: Recipe[] = initialRecipes;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Recipes</Text>

      {recipes.length === 0 ? (
        <View style={styles.empty}> 
          <Text style={styles.emptyText}>You have no recipes yet</Text>
          <Text style={styles.emptyHint}>Add a recipe to start cooking and planning meals.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/recipe-detail')}
            >
              <Text style={styles.buttonText}>Add recipe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // renders a scrollable list
        <FlatList
          data={recipes} 
          keyExtractor={(_, index) => index.toString()}
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
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.recipeSnippet}>
                {item.ingredients.split(',').slice(0.3).join(',')}
              </Text>
            </TouchableOpacity>
          )}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 50,
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
