import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRecipes } from '@/data/recipes-context';
import RecipeImage from '@/components/ui/recipe-image';


export default function HomeScreen() {
  const router = useRouter();
  const { recipes: savedRecipes } = useRecipes(); // only saved recipes

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Recipes</Text>

        {savedRecipes.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No recipes saved yet.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/add-recipe')}
            >
              <Text style={styles.buttonText}>Add Recipe</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={savedRecipes}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
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
              {/* Image container (always reserve space) */}
              <View style={styles.cardImageContainer}>
                <RecipeImage uri={item.image} style={styles.cardImage} />
              </View>

                {/* Title at bottom */}
                <Text style={styles.cardTitle}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* ===== Styles ===== */
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

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 12,
    paddingHorizontal: 24,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

/*  card: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginHorizontal: 4,
    marginBottom: 16,
    overflow: 'hidden',
    alignItems: 'center',
  },
  */
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


