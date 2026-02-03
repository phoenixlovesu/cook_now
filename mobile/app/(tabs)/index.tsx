import { Image, Platform, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { HelloWave } from '@/components/hello-wave';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      // Tiny placeholder image to satisfy TypeScript
      headerImage={<Image source={{ uri: 'https://via.placeholder.com/1' }} style={{ width: 1, height: 1 }} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Cook Now!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Add ingredients</ThemedText>
        <ThemedText>
          Start by adding what you have in your fridge and pantry to see what you can cook today!
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore Recipes</ThemedText>
          </Link.Trigger>
        </Link>
        <ThemedText>Tap here to see recipe suggestions based on your ingredients</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get started</ThemedText>
        <ThemedText>
          When ready, MVP will soon connect to the backend to generate recipes and grocery lists automatically
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
});
