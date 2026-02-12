/*
import { useTheme, ThemeType } from '@/context/ThemeProvider';


const { theme, toggleTheme, isDark } = useTheme();

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: { backgroundColor: theme.background },
    text: { color: theme.textPrimary },
    // ... rest of your styles
  });
  */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Calendar from 'expo-calendar';
import { useRecipes, Recipe } from '@/data/recipes-context';
import { useTheme, ThemeType } from '@/context/ThemeProvider';
import { Fonts } from '@/constants/theme';

export default function ScheduleRecipeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // recipe id from GroceryList
  const { recipes } = useRecipes();

  const recipe = recipes.find(r => r.id === id) as Recipe;
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- Handle date/time selection ---
  const handleDateChange = (event: any, date?: Date) => {
    if (date) setSelectedDate(date); // just update state, don't hide picker
  };

  // --- Add recipe to calendar and go back ---
  const addToCalendar = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Calendar access is needed.');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.allowsModifications);

      if (!defaultCalendar) {
        Alert.alert('No editable calendar found');
        return;
      }

      const endDate = new Date(selectedDate.getTime() + 60 * 60 * 1000); // 1 hr
      await Calendar.createEventAsync(defaultCalendar.id, {
        title: `Cook: ${recipe.name}`,
        startDate: selectedDate,
        endDate,
        notes: recipe.ingredients.map(i => `• ${i.name}`).join('\n'),
        url: `cooknow://recipe/${recipe.id}`,
        timeZone: 'UTC',
      });

      Alert.alert('Added to Calendar', `${recipe.name} added to your calendar.`);
      setShowConfirmModal(false);
      router.back(); // go back to Grocery List
    } catch (e) {
      console.log('Calendar error:', e);
      Alert.alert('Failed to add to calendar');
    }
  };

  // --- Go back without scheduling ---
  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Back button */}
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.accent }]}>← Back</Text>
        </TouchableOpacity>

        {/* Recipe title */}
        <Text style={styles.title}>{recipe.name}</Text>

        {/* Instructions for the user */}
        <Text style={styles.instructions}>
          Select the date and time you want to schedule cooking this recipe.
        </Text>

        {/* DateTime picker */}
        {showPicker && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
            />

            {/* Confirm Date & Time button */}
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: theme.accent, marginTop: 16 }]}
              onPress={() => setShowConfirmModal(true)}
            >
              <Text style={[styles.confirmButtonText, { color: theme.buttonText }]}>
                Confirm Date & Time
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Confirmation modal */}
        <Modal visible={showConfirmModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Calendar Event</Text>
              <Text style={styles.modalText}>Recipe: {recipe.name}</Text>
              <Text style={styles.modalText}>
                Date: {selectedDate.toLocaleString()}
              </Text>
              <Text style={styles.modalText}>
                Ingredients:
                {'\n'}
                {recipe.ingredients.map(i => `• ${i.name}`).join('\n')}
              </Text>
              <Text style={styles.modalLink}>Link: cooknow://recipe/{recipe.id}</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.confirmButton, { backgroundColor: theme.accent }]}
                  onPress={addToCalendar}
                >
                  <Text style={[styles.confirmButtonText, { color: theme.buttonText }]}>
                    Add to Calendar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cancelButton, { borderColor: theme.accent }]}
                  onPress={() => setShowConfirmModal(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.accent }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================
   Themed Styles
========================= */
const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: 24,
    },
    backButton: {
      marginBottom: 12,
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.sans,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 12,
      color: theme.textPrimary,
      fontFamily: Fonts.sans,
    },
    instructions: {
      fontSize: 16,
      marginBottom: 16,
      color: theme.textSecondary,
      fontFamily: Fonts.sans,
    },
    pickerContainer: {
      marginBottom: 24,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '90%',
      borderRadius: 12,
      padding: 16,
      backgroundColor: theme.card,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 12,
      fontFamily: Fonts.sans,
      color: theme.textPrimary,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 8,
      fontFamily: Fonts.sans,
      color: theme.textPrimary,
    },
    modalLink: {
      fontSize: 14,
      marginBottom: 16,
      fontFamily: Fonts.sans,
      textDecorationLine: 'underline',
      color: theme.accent,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    confirmButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginRight: 8,
    },
    confirmButtonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.sans,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      marginLeft: 8,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.sans,
    },
  });
