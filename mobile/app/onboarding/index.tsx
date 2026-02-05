import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Fonts } from '@/constants/theme';

// Get the device screen width; onboarding pages takes up the full screen
const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  // Track current page for dots
  const [pageIndex, setPageIndex] = useState(0);

  // Sends user to main app with replace(); prevents user going back to onboarding
  const goToApp = () => {
    router.replace('/(tabs)');
  };

  // background images
  const backgrounds = [
    require('@/assets/images/onboarding1.jpg'),
    require('@/assets/images/onboarding2.jpg'),
    require('@/assets/images/onboarding3.jpg'),
  ];

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
        {backgrounds.map((bg, i) => (
          <ImageBackground
            key={i}
            source={bg}
            style={styles.page}
            resizeMode='cover'
            >
             <View style={styles.content}>
                <Text style={styles.appTitle}>cook now</Text>
                {i === 0 && <Text style={styles.welcome}>Welcome</Text>}

              <View style={styles.textBlock}>
                {i === 0 && (
                  <View>
                    <Text style={styles.title}>Save recipes you want to make</Text>
                    <Text style={styles.subtitle}>From videos, cookbooks, or anywhere.</Text>
                  </View>
                )}

                {i === 1 && (
                  <View>
                    <Text style={styles.title}>Automatically organize ingredients</Text>
                    <Text style={styles.subtitle}>Know what you have and what you’re missing.</Text>
                  </View>
                )}

                {i === 2 && (
                  <View>
                    <Text style={styles.title}>Turn inspiration into action</Text>
                    <Text style={styles.subtitle}>Plan meals and generate grocery lists effortlessly.</Text>
                  </View>
                )}
              </View>
             </View>
          </ImageBackground>
        ))}
      </ScrollView>

      {/* Page indicator UI (dots) */}
      <View style={styles.dots}>
        {backgrounds.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { opacity: pageIndex === i ? 1 : 0.3 }]}
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
    backgroundColor: '#FFF',
  },

  skip: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10, // keeps above other elements
  },

  skipText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  page: {
    width, // full screeen width
    flex: 1, // take full height
    height: '100%',
    paddingHorizontal: 32,
    justifyContent: 'center'
  },

  content: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  appTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  welcome: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },

  // wrapper for title + subtitle
  textBlock: {
    marginTop: 200, // move subtitle closer to Get started button
    alignItems: 'center',
    gap: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    textAlign: 'center',
  },

  dots: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },

  // get started button
  button: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

