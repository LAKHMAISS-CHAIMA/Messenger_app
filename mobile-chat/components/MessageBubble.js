import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';

const MessageBubble = ({ message, isCurrentUser }) => {
  return (
    <View style={[styles.container, isCurrentUser ? styles.currentUser : styles.otherUser]}>
      {!isCurrentUser && (
        <Avatar
          rounded
          source={{ uri: message.user.avatar }}
          size="small"
          containerStyle={styles.avatar}
        />
      )}
      <View style={[styles.bubble, isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
        {!isCurrentUser && <Text style={styles.username}>{message.user.name}</Text>}
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.time}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  currentUser: {
    justifyContent: 'flex-end',
  },
  otherUser: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 15,
    marginHorizontal: 8,
  },
  currentUserBubble: {
    backgroundColor: '#DCF8C6',
  },
  otherUserBubble: {
    backgroundColor: '#ECECEC',
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 12,
  },
  messageText: {
    fontSize: 16,
  },
  time: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  avatar: {
    marginRight: 8,
  },
});

export default MessageBubble;