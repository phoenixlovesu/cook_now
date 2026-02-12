import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MOCK_RECIPES } from '@/data/mock-recipes';
import type { Recipe } from '@/data/recipes-context';
import RecipeImage from '@/components/ui/recipe-image';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { lightTheme, darkTheme, Fonts } from '@/constants/theme';
import { useTheme, ThemeType } from '@/context/ThemeProvider';

export default function FridgeScreen() {
    const { theme, toggleTheme, isDark } = useTheme();
    const styles = createStyles(theme);

  const [fridgeItems, setFridgeItems] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleAddIngredient = () => {
    const ingredient = input.trim().toLowerCase();
    if (ingredient && !fridgeItems.includes(ingredient)) {
      setFridgeItems(prev => [...prev, ingredient]);
    }
    setInput('');
  };

  const recipesToShow: Recipe[] = fridgeItems.length
    ? MOCK_RECIPES
        .map(recipe => {
          const matchCount = recipe.ingredients.filter(ingredient =>
            fridgeItems.some(item =>
              ingredient.name.toLowerCase().includes(item)
            )
          ).length;

          return { recipe, matchCount };
        })
        .filter(r => r.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount)
        .map(r => r.recipe)
    : [];

  const content = (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{`What's in My Fridge`}</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            { 
              borderColor: theme.divider, 
              color: theme.textPrimary, 
              fontFamily: Fonts.sans 
            }
          ]}
          placeholder="Add ingredient..."
          placeholderTextColor={theme.textSecondary}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAddIngredient}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.accent }]}
          onPress={handleAddIngredient}
        >
          <Text style={[styles.addButtonText, { fontFamily: Fonts.sans }]}>Add</Text>
        </TouchableOpacity>
      </View>

      {fridgeItems.length > 0 && (
        <View style={styles.chipsContainer}>
          {fridgeItems.map(item => (
            <View key={item} style={[styles.chip, { backgroundColor: theme.card }]}>
              <Text style={[styles.chipText, { color: theme.textPrimary, fontFamily: Fonts.sans }]}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {recipesToShow.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
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
              style={[styles.card, { backgroundColor: theme.card }]}
              onPress={() =>
                router.push({
                  pathname: '/recipe/[id]',
                  params: { id: item.id },
                })
              }
            >
              <View style={styles.cardImageContainer}>
                <RecipeImage uri={item.image} style={styles.cardImage} />
              </View>
              <Text style={[styles.cardTitle, { color: theme.textPrimary, fontFamily: Fonts.sans }]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {Platform.OS === 'web' ? (
        content
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {content}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
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
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },

  addButton: {
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
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  card: {
    flex: 1,
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    alignItems: 'center',
  },

  cardImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },

  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 8,
    textAlign: 'center',
  },
});

    
