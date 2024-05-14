import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';

const Voiceinput = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    initializeVoice();

    return () => {
      Voice.removeAllListeners();
    };
  }, []);

  const initializeVoice = async () => {
    try {
      const isAvailable = await Voice.isAvailable();
      if (!isAvailable) {
        throw new Error('Voice recognition is not available');
      }

      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechEnd = onSpeechEnd;
    } catch (err) {
      setError(err.message || 'Failed to initialize voice recognition');
    }
  };

  const onSpeechResults = (e) => {
    setResult(e.value[0]);
  };

  const onSpeechError = (err) => {
    setError(err.error);
  };

  const onSpeechEnd = () => {
    setIsRecording(false);
  };

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
      setIsRecording(true);
      setResult('');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (err) {
      setError(err.message || 'Failed to stop recording');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Input</Text>
      <Text style={styles.result}>Result: {result}</Text>
      <Text style={styles.error}>Error: {error}</Text>
      <TouchableOpacity style={styles.button} onPress={isRecording ? stopRecording : startRecording}>
        <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 20,
    marginBottom: 20,
  },
  error: {
    fontSize: 20,
    marginBottom: 20,
    color: 'red',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Voiceinput;
