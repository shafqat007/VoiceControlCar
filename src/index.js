import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { db } from '../config';
import { ref, set } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddData = () => {
  const [stopPressed, setStopPressed] = useState(false);
  const [forwardPressed, setForwardPressed] = useState(false);
  const [backwardPressed, setBackwardPressed] = useState(false);
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const navigation = useNavigation(); // Initialize navigation

  const sendData = (direction) => {
    const data = {
      direction,
      timestamp: new Date().toISOString() // Add timestamp for reference
    };

    set(ref(db, 'posts/'), data)
      .then(() => {
        console.log('Data sent successfully:', data);
      })
      .catch((error) => {
        console.error('Error sending data:', error);
      });
  };

  const handlePressIn = (direction) => {
    switch (direction) {
      case 'stop':
        setStopPressed(true);
        sendData('stop');
        break;
      case 'forward':
        setForwardPressed(true);
        sendData('Go:F');
        break;
      case 'backward':
        setBackwardPressed(true);
        sendData('Go:B');
        break;
      case 'left':
        setLeftPressed(true);
        sendData('Go:L');
        break;
      case 'right':
        setRightPressed(true);
        sendData('Go:R');
        break;
      default:
        break;
    }
  };

  const handlePressOut = (direction) => {
    switch (direction) {
      case 'stop':
        setStopPressed(false);
        break;
      case 'forward':
        setForwardPressed(false);
        sendData('stop');
        break;
      case 'backward':
        setBackwardPressed(false);
        sendData('stop');
        break;
      case 'left':
        setLeftPressed(false);
        sendData('stop');
        break;
      case 'right':
        setRightPressed(false);
        sendData('stop');
        break;
      default:
        break;
    }
  };

  // Function to navigate to Voice page
  const goToVoicePage = () => {
    navigation.navigate('Voice');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Controller</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, forwardPressed && styles.activeButton]}
          onPressIn={() => handlePressIn('forward')}
          onPressOut={() => handlePressOut('forward')}>
          <Icon name="arrow-up" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, leftPressed && styles.activeButton]}
          onPressIn={() => handlePressIn('left')}
          onPressOut={() => handlePressOut('left')}>
          <Icon name="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.stopButton, stopPressed && styles.activeButton]}
          onPressIn={() => handlePressIn('stop')}
          onPressOut={() => handlePressOut('stop')}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, rightPressed && styles.activeButton]}
          onPressIn={() => handlePressIn('right')}
          onPressOut={() => handlePressOut('right')}>
          <Icon name="arrow-right" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, backwardPressed && styles.activeButton]}
          onPressIn={() => handlePressIn('backward')}
          onPressOut={() => handlePressOut('backward')}>
          <Icon name="arrow-down" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Button to navigate to Voice.js page */}
      <TouchableOpacity onPress={goToVoicePage} style={styles.voiceButton}>
        <Text style={styles.voiceButtonText}>Go to Voice Page</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 60,
    height: 60,
    backgroundColor: '#3498db',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeButton: {
    backgroundColor: '#2980b9',
  },
  stopButton: {
    backgroundColor: '#e74c3c', // Red color for stop button
  },
  voiceButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  voiceButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
