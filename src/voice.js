import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import Voice from '@react-native-voice/voice';

const Voiceinput = () => {
  // const navigation = useNavigation(); // Initialize navigation
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    initializeVoice();

    return () => {
      Voice.removeAllListeners();
    };
  }, []);
  // const goToIndexPage = () => {
  //   navigation.navigate('AddData');
  // };

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
      {/* Back button */}
      {/* <TouchableOpacity onPress={goToIndexPage} style={styles.voiceButton}>
        <Text style={styles.voiceButtonText}>Go to Index Page</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  goToIndexButton: {
    marginTop: 10,
  },
  goToIndexButtonText: {
    color: '#3498db',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Voiceinput;
