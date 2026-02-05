import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';

/**
 * Mock recipe data inspired by real recipes from eitanbernath.com
 * FOR DEMO/SUBMISSION PURPOSES ONLY
 * These will be removed before production release
 */
const MOCK_RECIPES = [
  {
    id: '1',
    name: 'Sesame Schnitzel with Loaded Salad',
    ingredients: `Chicken cutlets
Breadcrumbs
Sesame seeds
Mixed greens
Tomatoes
Tahini`,
    instructions: `1. Bread chicken with sesame breadcrumbs.
2. Fry until crispy and golden.
3. Top with fresh salad and drizzle with tahini.`,
    link: 'https://www.eitanbernath.com/2024/06/06/sesame-schnitzel-topped-with-loaded-salad/',
  },
  {
    id: '2',
    name: 'Heirloom Tomato Caprese Pizza',
    ingredients: `Pizza dough
Fresh mozzarella
Heirloom tomatoes
Basil
Olive oil`,
    instructions: `1. Stretch dough and bake until lightly crisp.
2. Top with mozzarella and tomatoes.
3. Finish with basil and olive oil.`,
    link: 'https://www.eitanbernath.com/2024/01/31/caprese-pizza/'
  },
  {
    id: '3',
    name: 'Wild Mushroom Thyme Risotto',
    ingredients: `Arborio rice
Wild mushrooms
Vegetable stock
Thyme
Parmesan`,
    instructions: `1. Sauté mushrooms until browned.
2. Slowly stir stock into rice.
3. Finish with thyme and parmesan.`,
    link: 'https://www.eitanbernath.com/2023/07/25/wild-mushroom-thyme-risotto/',
  },
  {
    id: '4',
    name: 'Better-Than-Stove-Top Stuffing',
    ingredients: `Bread cubes
Onion
Celery
Butter
Herbs`,
    instructions: `1. Toast bread until dry.
2. Cook vegetables in butter.
3. Toss together and bake until crisp.`,
    link: 'https://www.eitanbernath.com/2023/11/20/better-than-stove-top-stuffing/',
  },
  {
    id: '5',
    name: 'Salted Caramel Chocolate Chip Cookies',
    ingredients: `Flour
Butter
Sugar
Chocolate chips
Caramel`,
    instructions: `1. Mix dough and fold in caramel.
2. Bake until golden.
3. Finish with flaky salt.`,
    link: 'https://www.eitanbernath.com/2023/06/20/salted-caramel-stuffed-chocolate-chip-cookies/',
  },
  {
    id: '6',
    name: 'Aloo Tikki Chaat',
    ingredients: `Potatoes
Spices
Yogurt
Chutneys`,
    instructions: `1. Form spiced potato patties.
2. Pan-fry until crisp.
3. Top with yogurt and chutney.`,
    link: 'https://www.eitanbernath.com/2023/04/04/aloo-tikki-chaat/',
  },
  {
    id: '7',
    name: 'Popcorn Chicken with Pickles',
    ingredients: `Chicken
Flour
Spices
Pickles`,
    instructions: `1. Bread bite-sized chicken.
2. Fry until crunchy.
3. Serve with homemade pickles.`,
    link: 'https://www.eitanbernath.com/2022/12/09/popcorn-chicken-two-ways-with-homemade-pickles/',
  },
  {
    id: '8',
    name: 'Warm Winter Salad',
    ingredients: `Greens
Roasted vegetables
Sun-dried tomatoes
Vinaigrette`,
    instructions: `1. Roast vegetables until tender.
2. Toss with greens.
3. Finish with vinaigrette.`,
    link: 'https://www.eitanbernath.com/2022/11/18/warm-winter-salad-with-sun-dried-tomato-vinaigrette/',
  },
  {
    id: '9',
    name: 'Hummus with Spiced Lamb',
    ingredients: `Chickpeas
Tahini
Ground lamb
Spices`,
    instructions: `1. Blend hummus until smooth.
2. Cook spiced lamb.
3. Spoon lamb over hummus.`,
    link: 'https://www.eitanbernath.com/2022/12/02/hummus-with-spiced-lamb-and-herby-tahini/',
  },
  {
    id: '10',
    name: 'Blackberry Thyme Margarita',
    ingredients: `Blackberries
Tequila
Lime
Thyme`,
    instructions: `1. Muddle blackberries with thyme.
2. Shake with tequila and lime.
3. Serve over ice.`,
    link: 'https://www.eitanbernath.com/2023/05/25/blackberry-thyme-margarita/',
  },
];


export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Filter recipes by name or ingredient text
  const filteredRecipes = MOCK_RECIPES.filter(recipe =>
    recipe.name.toLowerCase().includes(query.toLowerCase()) ||
    recipe.ingredients.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Screen title */}
      <Text style={styles.title}>Search Recipes</Text>

      {/* Search input */}
      <TextInput
        placeholder="Search by name or ingredient"
        placeholderTextColor="#999"
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />

      {/* Recipe results */}
      <FlatList
        data={filteredRecipes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/recipe-detail',
                params: item,
              })
            }
          >
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeHint}>Tap to view recipe</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* ======= STYLES ========= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 40,
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
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    color: Colors.light.text,
  },
  recipeHint: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
});
