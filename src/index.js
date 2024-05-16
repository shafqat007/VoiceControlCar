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
          minimumValue={0}
          maximumValue={255}
          value={speed}
          onValueChange={(value) => setSpeed(value)}
        />
      </View>
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
    backgroundColor: '#e74c3c',
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
  sliderContainer: {
    width: '80%',
    alignItems: 'center',
    marginVertical: 20,
  },
  slider: {
    width: '100%',
  },
  rotateLeft: {
    transform: [{ rotate: '-45deg' }],
  },
  rotateRight: {
    transform: [{ rotate: '45deg' }],
  },
});
