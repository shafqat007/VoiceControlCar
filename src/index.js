import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config';
import { ref, set } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';

const AddData = () => {
  const [pressedButtons, setPressedButtons] = useState({});
  const [speed, setSpeed] = useState(120); // Initial speed value
  const navigation = useNavigation();

  const fixedSpeeds = [40, 80, 120, 160, 200, 255];

  const sendData = (direction) => {
    const data = {
      direction,
      speed,
      timestamp: new Date().toISOString()
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
    setPressedButtons(prevState => ({ ...prevState, [direction]: true }));
    sendData(direction);
  };

  const handlePressOut = (direction) => {
    setPressedButtons(prevState => ({ ...prevState, [direction]: false }));
    sendData('stop');
  };

  const goToVoicePage = () => {
    navigation.navigate('Voice');
  };
  const goToMapPage = () => {
    navigation.navigate('Map');
  };

  const renderButton = (direction, icon, additionalStyles = {}) => (
    <TouchableOpacity
      style={[styles.button, pressedButtons[direction] && styles.activeButton, additionalStyles]}
      onPressIn={() => handlePressIn(direction)}
      onPressOut={() => handlePressOut(direction)}
    >
      <Icon name={icon} size={30} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Controller</Text>
      <View style={styles.row}>
        {renderButton('Go:FL', 'arrow-up', styles.rotateLeft)}
        {renderButton('Go:F', 'arrow-up')}
        {renderButton('Go:FR', 'arrow-up', styles.rotateRight)}
      </View>
      <View style={styles.row}>
        {renderButton('Go:L', 'arrow-left')}
        <TouchableOpacity
          style={[styles.button, styles.stopButton, pressedButtons['stop'] && styles.activeButton]}
          onPressIn={() => handlePressIn('stop')}
          onPressOut={() => handlePressOut('stop')}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
        {renderButton('Go:R', 'arrow-right')}
      </View>
      <View style={styles.row}>
        {renderButton('Go:BL', 'arrow-down', styles.rotateRight)}
        {renderButton('Go:B', 'arrow-down')}
        {renderButton('Go:BR', 'arrow-down', styles.rotateLeft)}
      </View>
      <View style={styles.sliderContainer}>
        <Text>Speed: {speed}</Text>
        <Slider
          style={styles.slider}
          minimumValue={40}
          maximumValue={255}
          step={1}
          value={speed}
          onValueChange={(value) => {
            const nearestValue = fixedSpeeds.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
            setSpeed(nearestValue);
          }}
        />
      </View>
      <TouchableOpacity onPress={goToVoicePage} style={styles.voiceButton}>
        <Text style={styles.voiceButtonText}>Go to Voice Page</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToMapPage} style={styles.voiceButton}>
        <Text style={styles.voiceButtonText}>Go to Map Page</Text>
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
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius:5,
    margin: 5,
  },
  activeButton: {
    backgroundColor: '#1976D2',
  },
  stopButton: {
    backgroundColor: '#FF0000',
    borderRadius:100
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  rotateLeft: {
    transform: [{ rotate: '-45deg' }],
    borderRadius:5
  },
  rotateRight: {
    transform: [{ rotate: '45deg' }],
    borderRadius:5
  },
  sliderContainer: {
    width: '80%',
    padding: 20,
  },
  slider: {
    width: '100%',
  },
  voiceButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  voiceButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
