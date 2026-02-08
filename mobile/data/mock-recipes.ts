/**
 * Mock recipe data inspired by real recipes from eitanbernath.com
 * FOR DEMO/SUBMISSION PURPOSES ONLY
 * These will be removed before production release
 */

export type Ingredient = {
  name: string;
  hasIt: boolean;
};

export type RecipeSource = 'mock' | 'api' | 'user';

export type Recipe = {
  id: string; // unique string
  name: string;
  ingredients: { name: string; hasIt: boolean }[];
  instructions: string;
  link?: string;
  image?: string; // optional for API or mock images
  source?: RecipeSource;
};

/* new type for Add REcipe Screen*/
export type NewRecipe = {
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  link?: string;
};

// central mock data so every screen uses the same source
// will replace with API data later
export const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Sesame Schnitzel with Loaded Salad',
    ingredients: [
      { name: 'Chicken cutlets', hasIt: false },
      { name: 'Breadcrumbs', hasIt: false },
      { name: 'Sesame seeds', hasIt: false },
      { name: 'Mixed greens', hasIt: false },
      { name: 'Tomatoes', hasIt: false },
      { name: 'Tahini', hasIt: false },
    ],
    instructions: `1. Bread chicken with sesame breadcrumbs.
2. Fry until crispy and golden.
3. Top with fresh salad and drizzle with tahini.`,
    link: 'https://www.eitanbernath.com/2024/06/06/sesame-schnitzel-topped-with-loaded-salad/',
    image: 'https://unsplash.com/photos/a-plate-of-food-and-a-cup-of-tea-x8P-CPnEbfk',
    source: 'mock',
  },
  {
    id: '2',
    name: 'Heirloom Tomato Caprese Pizza',
    ingredients: [
      { name: 'Pizza dough', hasIt: false },
      { name: 'Fresh mozzarella', hasIt: false },
      { name: 'Heirloom tomatoes', hasIt: false },
      { name: 'Basil', hasIt: false },
      { name: 'Olive oil', hasIt: false },
    ],
    instructions: `1. Stretch dough and bake until lightly crisp.
2. Top with mozzarella and tomatoes.
3. Finish with basil and olive oil.`,
    link: 'https://www.eitanbernath.com/2024/01/31/caprese-pizza/',
    image: 'https://unsplash.com/photos/a-pizza-sitting-on-top-of-a-table-next-to-a-spatula-YUae3JfvGi8',
    source: 'mock',
  },
  {
    id: '3',
    name: 'Wild Mushroom Thyme Risotto',
    ingredients: [
      { name: 'Arborio rice', hasIt: false },
      { name: 'Wild mushrooms', hasIt: false },
      { name: 'Vegetable stock', hasIt: false },
      { name: 'Thyme', hasIt: false },
      { name: 'Parmesan', hasIt: false },
    ],
    instructions: `1. Sauté mushrooms until browned.
2. Slowly stir stock into rice.
3. Finish with thyme and parmesan.`,
    link: 'https://www.eitanbernath.com/2023/07/25/wild-mushroom-thyme-risotto/',
    image: 'https://unsplash.com/photos/brown-wooden-bowl-with-food-z32XV0TGSzc',
    source: 'mock',
  },
  {
    id: '4',
    name: 'Better-Than-Stove-Top Stuffing',
    ingredients: [
      { name: 'Bread cubes', hasIt: false },
      { name: 'Onion', hasIt: false },
      { name: 'Celery', hasIt: false },
      { name: 'Butter', hasIt: false },
      { name: 'Herbs', hasIt: false },
    ],
    instructions: `1. Toast bread until dry.
2. Cook vegetables in butter.
3. Toss together and bake until crisp.`,
    link: 'https://www.eitanbernath.com/2023/11/20/better-than-stove-top-stuffing/',
    image: 'https://unsplash.com/photos/mixed-vegetable-in-tray-1rq-jAmPlz4',
    source: 'mock',
  },
  {
    id: '5',
    name: 'Salted Caramel Chocolate Chip Cookies',
    ingredients: [
      { name: 'Flour', hasIt: false },
      { name: 'Butter', hasIt: false },
      { name: 'Sugar', hasIt: false },
      { name: 'Chocolate chips', hasIt: false },
      { name: 'Caramel', hasIt: false },
    ],
    instructions: `1. Mix dough and fold in caramel.
2. Bake until golden.
3. Finish with flaky salt.`,
    link: 'https://www.eitanbernath.com/2023/06/20/salted-caramel-stuffed-chocolate-chip-cookies/',
    image: 'https://unsplash.com/photos/a-stack-of-cookies-sitting-on-top-of-a-piece-of-wax-paper-eUtuXrT9ZLw',
    source: 'mock',
  },
  {
    id: '6',
    name: 'Aloo Tikki Chaat',
    ingredients: [
      { name: 'Potatoes', hasIt: false },
      { name: 'Spices', hasIt: false },
      { name: 'Yogurt', hasIt: false },
      { name: 'Chutneys', hasIt: false },
    ],
    instructions: `1. Form spiced potato patties.
2. Pan-fry until crisp.
3. Top with yogurt and chutney.`,
    link: 'https://www.eitanbernath.com/2023/04/04/aloo-tikki-chaat/',
    image: 'https://www.pexels.com/photo/rustic-baked-potatoes-with-fresh-herbs-30120983/',
    source: 'mock',
  },
  {
    id: '7',
    name: 'Popcorn Chicken with Pickles',
    ingredients: [
      { name: 'Chicken', hasIt: false },
      { name: 'Flour', hasIt: false },
      { name: 'Spices', hasIt: false },
      { name: 'Pickles', hasIt: false },
    ],
    instructions: `1. Bread bite-sized chicken.
2. Fry until crunchy.
3. Serve with homemade pickles.`,
    link: 'https://www.eitanbernath.com/2022/12/09/popcorn-chicken-two-ways-with-homemade-pickles/',
    image: 'https://www.pexels.com/photo/close-up-of-chicken-wings-in-a-bowl-5923475/',
    source: 'mock',
  },
  {
    id: '8',
    name: 'Warm Winter Salad',
    ingredients: [
      { name: 'Greens', hasIt: false },
      { name: 'Roasted vegetables', hasIt: false },
      { name: 'Sun-dried tomatoes', hasIt: false },
      { name: 'Vinaigrette', hasIt: false },
    ],
    instructions: `1. Roast vegetables until tender.
2. Toss with greens.
3. Finish with vinaigrette.`,
    link: 'https://www.eitanbernath.com/2022/11/18/warm-winter-salad-with-sun-dried-tomato-vinaigrette/',
    image: 'https://unsplash.com/photos/plate-of-food-surrounded-by-uncut-vegetables-C77jmp3Hg1M', 
    source: 'mock',
  },
  {
    id: '9',
    name: 'Hummus with Spiced Lamb',
    ingredients: [
      { name: 'Chickpeas', hasIt: false },
      { name: 'Tahini', hasIt: false },
      { name: 'Ground lamb', hasIt: false },
      { name: 'Spices', hasIt: false },
    ],
    instructions: `1. Blend hummus until smooth.
2. Cook spiced lamb.
3. Spoon lamb over hummus.`,
    link: 'https://www.eitanbernath.com/2022/12/02/hummus-with-spiced-lamb-and-herby-tahini/',
    image: 'https://www.pexels.com/photo/herb-and-meat-on-hummus-19328883/',
    source: 'mock',
  },
  {
    id: '10',
    name: 'Blackberry Thyme Margarita',
    ingredients: [
      { name: 'Blackberries', hasIt: false },
      { name: 'Tequila', hasIt: false },
      { name: 'Lime', hasIt: false },
      { name: 'Thyme', hasIt: false },
    ],
    instructions: `1. Muddle blackberries with thyme.
2. Shake with tequila and lime.
3. Serve over ice.`,
    link: 'https://www.eitanbernath.com/2023/05/25/blackberry-thyme-margarita/',
    image: 'https://unsplash.com/photos/a-drink-with-a-slice-of-watermelon-on-the-side-fKWsh6X9QZs',
    source: 'mock',
  },
];