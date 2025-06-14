import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Card, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { joinRoom } from '../../config/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RoomScreen = () => {
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Create a temporary user if none exists
    const setupUser = async () => {
      try {
        const existingUser = await AsyncStorage.getItem('user');
        if (!existingUser) {
          const tempUser = {
            id: `user_${Date.now()}`,
            name: `Utilisateur_${Math.floor(Math.random() * 1000)}`,
            avatar: 'https://example.com/default-avatar.jpg'
          };
          await AsyncStorage.setItem('user', JSON.stringify(tempUser));
        }
      } catch (error) {
        console.error('Error setting up user:', error);
      }
    };

    setupUser();
  }, []);

  const handleJoinRoom = async () => {
    if (roomCode.trim()) {
      setIsLoading(true);
      try {
        const userString = await AsyncStorage.getItem('user');
        if (!userString) {
          throw new Error('Erreur de configuration utilisateur');
        }

        const user = JSON.parse(userString);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        joinRoom(roomCode);
        navigation.navigate('ChatScreen', { roomCode });
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de rejoindre la salle');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.title}>Rejoindre une salle de discussion</Card.Title>
        <Card.Divider />
        
        <Input
          placeholder="Code de la salle"
          leftIcon={{ type: 'material', name: 'meeting-room' }}
          value={roomCode}
          onChangeText={setRoomCode}
          inputStyle={styles.input}
          containerStyle={styles.inputContainer}
        />
        
        <Text style={styles.note}>
          Demandez le code à la personne qui a créé la salle
        </Text>
        
        <Button
          title="Rejoindre"
          onPress={handleJoinRoom}
          buttonStyle={styles.button}
          loading={isLoading}
          disabled={!roomCode.trim() || isLoading}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    paddingLeft: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#075e54',
    borderRadius: 5,
    paddingVertical: 12,
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default RoomScreen;