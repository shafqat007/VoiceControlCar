import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

export default function Voice() {
  const navigation = useNavigation(); // Initialize navigation

  // Function to navigate back to AddData page
  const goToAddDataPage = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Voice Page</Text>

      {/* Button to navigate back to AddData page */}
      <TouchableOpacity onPress={goToAddDataPage} style={styles.button}>
        <Text style={styles.buttonText}>Go to Controller Page</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
