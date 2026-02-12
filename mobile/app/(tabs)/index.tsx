import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useRecipes } from '@/data/recipes-context';
import RecipeImage from '@/components/ui/recipe-image';
import { useTheme } from '@/context/ThemeProvider';
import { ThemeType } from '@/context/ThemeProvider';


export default function HomeScreen() {
  const router = useRouter();
  const { recipes: savedRecipes } = useRecipes();

  const { toggleTheme, isDark, theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Recipes</Text>

          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.themeToggle}
            accessibilityLabel="Toggle dark mode"
          >
          <Text style={styles.toggleIcon}>
            {isDark ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>

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
            keyExtractor={(item) => item.id}
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
                {/* Image container (always reserves space) */}
                <View style={styles.cardImageContainer}>
                  <RecipeImage uri={item.image} style={styles.cardImage} />
                </View>

                {/* Recipe title */}
                <Text style={styles.cardTitle}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* ================================
   Themed Styles
================================ */
const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
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
      color: theme.textPrimary,
    },

      themeToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: theme.card,
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  toggleIcon: {
    fontSize: 18,
  },

    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 16,
    },

    button: {
      backgroundColor: theme.accent,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
    },

    buttonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },

    row: {
      justifyContent: 'space-between',
      marginBottom: 16,
    },

    card: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 8,
      marginHorizontal: 4,
      marginBottom: 8,
    },

    cardImageContainer: {
      width: '100%',
      height: 120,
      backgroundColor: theme.divider, // placeholder color
      borderRadius: 8,
      overflow: 'hidden',
    },

    cardImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },

    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      paddingTop: 8,
      textAlign: 'center',
      color: theme.textPrimary,
    },
  });



