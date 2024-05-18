
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config';
import { ref, set, onValue } from 'firebase/database';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';

const AddData = () => {
  const [pressedButtons, setPressedButtons] = useState({});
  const [speed, setSpeed] = useState(120); // Initial speed value
  const [direction, setDirection] = useState(0); // Initial servo direction
  const [distance, setDistance] = useState(0); // Initial distance
  const navigation = useNavigation();

  const fixedSpeeds = [40, 80, 120, 160, 200, 255];
  const fixedDirections = Array.from({ length: 10 }, (_, i) => i * 20); // 0, 20, 40, ..., 180

  useEffect(() => {
    // Listener for distance updates from Firebase
    const distanceRef = ref(db, 'servo/distance');
    onValue(distanceRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setDistance(data);
      }
    });
  }, []);

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

  const sendDirection = (direction) => {
    set(ref(db, 'servo/direction'), direction)
      .then(() => {
        console.log('Direction sent successfully:', direction);
      })
      .catch((error) => {
        console.error('Error sending direction:', error);
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
      <Icon name={icon} size={30} color="#000" />
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
      <View style={styles.sliderContainer}>
        <Text>Direction: {direction}°</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={180}
          step={20}
          value={direction}
          onValueChange={(value) => {
            setDirection(value);
            sendDirection(value);
          }}
        />
      </View>
      <Text style={styles.distanceText}>Distance: {distance} cm</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={goToVoicePage} style={styles.navigationButton}>
          <Text style={styles.navigationButtonText}>Go to Voice Page</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToMapPage} style={styles.navigationButton}>
          <Text style={styles.navigationButtonText}>Go to Map Page</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 100,
    margin: 5,
  },
  activeButton: {
    backgroundColor: '#1976D2',
  },
  stopButton: {
    backgroundColor: '#FF0000',
    borderRadius: 100
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  rotateLeft: {
    transform: [{ rotate: '-45deg' }],
  },
  rotateRight: {
    transform: [{ rotate: '45deg' }],
  },
  sliderContainer: {
    width: '80%',
    padding: 20,
  },
  slider: {
    width: '100%',
  },
  distanceText: {
    fontSize: 16,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  navigationButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});