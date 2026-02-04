import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

// Get the device screen width; onboarding pages takes up the full screen
const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  // Track which onboarding page is active - for dots
  const [pageIndex, setPageIndex] = useState(0);

  // Sends user to main app with replace(); prevents user going back to onboarding
  const goToApp = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skip} onPress={goToApp}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Scrollable onboarding pages */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          /* Use Math.round to get page numbers because value (contentOffset.x / width)
             may not be whole while user is scrolling
          */
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setPageIndex(index);
        }}
        scrollEventThrottle={16} // onScroll fires every 16 milliseconds
      >

        {/* --------- Page 1 -----------*/}
        <View style={styles.page}>
          <View style={styles.branding}>
            <Text style={styles.appTitle}>cook now</Text>
            <Text style={styles.welcome}>Welcome</Text>
          </View>
          
          <View style={styles.textBlock}>
            <Text style={styles.title}>Save recipes you want to make</Text>
            <Text style={styles.subtitle}>
              From videos, cookbooks, or anywhere.
            </Text>
          </View>
        </View>

        {/* ------- Page 2 ---------- */}
        <View style={styles.page}>
          <View style={styles.branding}>
            <Text style={styles.appTitle}>cook now</Text>
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title}>Automatically organize ingredients</Text>
            <Text style={styles.subtitle}>
              Know what you have and what you’re missing.
            </Text>
          </View>
        </View>

        {/* ------- Page 3 ---------*/}
        <View style={styles.page}>
          <View style={styles.branding}>
            <Text style={styles.appTitle}>cook now</Text>
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title}>Turn inspiration into action</Text>
            <Text style={styles.subtitle}>
              Plan meals and generate grocery lists effortlessly.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Page indicator UI (dots) */}
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { opacity: pageIndex === i ? 1 : 0.3 },
            ]}
            />
        ))}
      </View>

      {/* Get started button (fixed) */}
      <TouchableOpacity style={styles.button} onPress={goToApp}>
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================== STYLES =================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  skip: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10, // keeps above other elements
  },

  skipText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },

  page: {
    width,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    // justifyContent: 'center',
    paddingTop: 120,
    paddingBottom: 160,
  },

  branding: {
    alignItems: 'center',
  },

  appTitle: {
    fontSize: 36,
    fontWeight: '600',
    // marginBottom: 4,
    color: '#fff',
    letterSpacing: 0.5,
  },

  welcome: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },

  // wrapper for title + subtitle
  textBlock: {
    gap: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
    textAlign: 'center',
  },

  dots: {
    position: 'absolute',
    bottom: 110,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },

  // get started button
  button: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: '#2F5D50',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

