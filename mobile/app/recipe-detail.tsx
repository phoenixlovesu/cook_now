import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { Pressable, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RecipeDetailScreen() {
  const router = useRouter();

  // Get recipe data passed from Home screen
  // Example: router.push({ pathname: '/recipe-detail', params: { name, ingredients, instructions, link } })
  const { 
    name = 'Untitled Recipe', 
    ingredients = 'No ingredients provided.', 
    instructions = 'No instructions provided', 
    link 
  } = useLocalSearchParams<{
    name?: string;
    ingredients?: string;
    instructions?: string;
    link?: string;
  }>();

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
        {/* Header with back button */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>

        {/* Scrollable content for recipe details */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{name}</Text>

          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.text}>{ingredients || 'No ingredients listed.'}</Text>

          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.text}>{instructions || 'No instructions provided.'}</Text>

          {/* Optional link to original recipe */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 50,
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
    marginBottom: 8,
    color: Colors.light.text,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: Fonts.sans,
    color: Colors.light.text,
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
