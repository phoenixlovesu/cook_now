# Cook Now - Recipes & Grocery MVP

## Overview
Cook Now helps users turn **saved recipes** and **fridge ingredients** into meals they can actually make. Users can:  

- Save favorite recipes (mock recipes or fetched from MealDB API)  
- Add ingredients they have on hand  
- Discover recipes that match their available ingredients  
- Schedule recipes to their iOS calendar  
- Access personalized grocery lists (for Cook Now Pro users)  

This is a fully working **mobile MVP** designed for **TestFlight submission** to Shipyard and RevenueCat’s hackathon, following Eitan Bernath’s brief.  

## Tech Stack
- **React Native + Expo** – cross-platform mobile development  
- **JavaScript/TypeScript** – core logic and mock recipes  
- **Expo Router** – navigation between screens  
- **RevenueCat** – in-app purchases / subscriptions  
- **MealDB API** – dynamic recipe data  
- **Native iOS Calendar** – scheduling recipes  

## Screens / Features

### Onboarding
- Guides first-time users through app features.  

### Home / My Recipes
- Displays saved recipes in a **consistent card layout**.  
- Supports **dark/light mode toggle** for accessibility (top-right corner).  
- Clicking a recipe card opens **Recipe Detail** with:  
  - Ingredients  
  - Instructions  
  - Link to online source  
  - Save recipe if not already saved  
  - Schedule recipe button  

### Add Recipe
- Accessible from the **Home empty state**.  
- Users can input:  
  - Recipe name  
  - Ingredients  
  - Instructions  
  - Optional online link  
- Recipes save to the user’s home screen immediately.  

### Fridge
- Users add ingredients (partial or full, **case-insensitive**) using an **Add button**.  
- Ingredients display as **chips**, which can be removed individually.  
- Filters and suggests recipes based on fridge contents.  

### Search / Discover
- Users filter recipes **as they type**, matching by name or ingredients.  
- Works like a **smart search** across all available recipes.  

### Grocery List
- Generated automatically as users add/save recipes.  
- **Preview-only** for free users (one-time view).  
- **Cook Now Pro users** can:  
  - Toggle ingredients they have  
  - See updated missing ingredient counts on cards  
  - Fully interact with generated grocery lists  

### Schedule Recipe
- On Recipe Detail screen:  
  - Users select **date and time**  
  - Confirmation popup shows **recipe name, date, time, and ingredients**  
