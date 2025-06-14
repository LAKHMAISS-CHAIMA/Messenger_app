import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import MessageBubble from '../../components/MessageBubble';
import { initializeSocket, joinRoom, sendMessage, onMessageReceived, onUserListUpdated, disconnectSocket } from '../../config/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = ({ route }) => {
  const { roomCode } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const flatListRef = useRef();

  useEffect(() => {
    const setupSocket = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const socket = await initializeSocket(token);
      
      console.log('Joining room:', roomCode);
      joinRoom(roomCode);
      
      onMessageReceived((message) => {
        console.log('Message received:', message);
        setMessages(prev => {
          const newMessages = [...prev, message];
          console.log('Updated messages:', newMessages);
          return newMessages;
        });
        scrollToBottom();
      });
      
      onUserListUpdated((userList) => {
        console.log('User list updated:', userList);
        setUsers(userList);
      });
    };

    setupSocket();

    return () => {
      console.log('Cleaning up socket connection');
      disconnectSocket();
    };
  }, [roomCode]);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSendMessage = async () => {
  if (!newMessage.trim()) return;

  try {
    const userString = await AsyncStorage.getItem('user');
    if (!userString) {
      throw new Error('Aucun utilisateur trouvé dans le stockage local');
    }

    const user = JSON.parse(userString);
    
    if (!user?.id) {
      throw new Error('Les données utilisateur sont incomplètes');
    }

    const messageData = {
      text: newMessage,
      room: roomCode,
      user: {
        id: user.id,
        name: user.name || 'Anonyme',
        avatar: user.avatar || 'https://example.com/default-avatar.jpg',
      },
      timestamp: new Date().toISOString(),
    };

    console.log('Envoi du message:', messageData);
      sendMessage(messageData);
    setNewMessage('');

  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error);
    Alert.alert(
      'Erreur',
      'Impossible d\'envoyer le message. Veuillez vous reconnecter.',
      [{ text: 'OK' }]
    );
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <MessageBubble 
            message={item} 
            isCurrentUser={item.user.id === users.find(u => u.isCurrentUser)?.id}
          />
        )}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Écrivez un message..."
          multiline
        />
        <Button
          icon={<Icon name="send" size={24} color="white" />}
          onPress={handleSendMessage}
          buttonStyle={styles.sendButton}
          disabled={!newMessage.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: '#075e54',
  },
});

export default ChatScreen;