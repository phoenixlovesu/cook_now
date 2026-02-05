import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import {Colors, Fonts } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  // Sample data for recipes (empty at start)
  const recipes: { name: string }[] = [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Recipes</Text>

      {recipes.length === 0 ? (
        <View style={styles.empty}> 
          <Text style={styles.emptyText}>No recipes yet</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(tabs)/add-recipe')}
            >
              <Text style={styles.buttonText}>Add recipe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // renders a scrollable list
        <FlatList
          data={recipes} // recipe array
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.recipeItem}>
              <Text style={styles.recipeName}>{item.name}</Text>
            </View>
          )}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    marginBottom: 24,
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
  recipeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recipeName: {
    fontSize: 18,
  },
});
