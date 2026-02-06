import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { Pressable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState } from 'react';

export default function RecipeDetailScreen() {
  const router = useRouter();

  // Get recipe data passed from Home / Add Recipe
  const { 
    name = 'Untitled Recipe', 
    ingredients = '', 
    instructions = '', 
    link 
  } = useLocalSearchParams<{
    name?: string;
    ingredients?: string;
    instructions?: string;
    link?: string;
  }>();

  /* ========== INGREDIENT CHECKLIST LOGIC ========== */

  // Convert ingredients string into array (one per line or comma)
  const ingredientList = ingredients
    .split(/\n|,/)
    .map(item => item.trim())
    .filter(Boolean);

  // Local checkbox state (not saved yet)
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    ingredientList.map(() => false)
  );

  // Toggle checkbox state
  const toggleItem = (index: number) => {
    setCheckedItems(prev =>
      prev.map((checked, i) => (i === index ? !checked : checked))
    );
  };

 // Open external link in browser
  const openLink = () => {
    if (link) {
      Linking.openURL(link).then((supported) => {
        if (supported) {
          Linking.openURL(link);
        } else {
            console.warn("Can't open URL:", link)
        }
      });
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>

        {/* Scrollable content */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{name}</Text>

          {/* Ingredients Checklist */}
          <Text style={styles.sectionTitle}>Ingredients</Text>

          {ingredientList.length === 0 ? (
            <Text style={styles.text}>No ingredients listed.</Text>
          ) : (
            ingredientList.map((item, index) => (
              <Pressable
                key={index}
                style={styles.checkboxRow}
                onPress={() => toggleItem(index)}
              >
                <Text style={styles.checkbox}>
                  {checkedItems[index] ? '☑' : '☐'}
                </Text>
                <Text
                  style={[
                    styles.ingredientText,
                    checkedItems[index] && styles.checkedText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))
          )}

          {/* Instructions */}
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.text}>
            {instructions || 'No instructions provided.'}
          </Text>

          {/* Optional link */}
          {link && (
            <Pressable style={styles.linkButton} onPress={openLink}>
              <Text style={styles.linkText}>View Original Recipe</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

/* ======== STYLES =========== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 60, // extra padding for island / notch
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  backText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: '600',
  },

  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    marginBottom: 24,
    color: Colors.light.text,
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    marginBottom: 12,
    color: Colors.light.text,
  },

  text: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: Fonts.sans,
    color: Colors.light.text,
  },

  /* Checklist styles */
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  checkbox: {
    fontSize: 20,
    marginRight: 12,
  },

  ingredientText: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    color: Colors.light.text,
  },

  checkedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  linkButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },

  linkText: {
    color: Colors.light.background,
    fontWeight: '600',
    fontSize: 16,
  },
});

