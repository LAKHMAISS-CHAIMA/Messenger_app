import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
// import AuthScreen from './screens/Auth';
import RoomScreen from './screens/Chat/RoomScreen';
import ChatScreen from './screens/Chat/ChatScreen';
import { Icon } from 'react-native-elements';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#075e54',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {/* <Stack.Screen 
            name="Auth" 
            component={AuthScreen} 
            options={{ title: 'Authentification' }}
          /> */}
          <Stack.Screen 
            name="RoomScreen" 
            component={RoomScreen} 
            options={{ title: 'Rejoindre une salle' }}
          />
          <Stack.Screen 
            name="ChatScreen" 
            component={ChatScreen} 
            options={({ route }) => ({ 
              title: `Salle: ${route.params.roomCode}`,
              headerRight: () => (
                <Icon
                  name="people-outline"
                  type="ionicon"
                  color="#fff"
                  onPress={() => console.log('Show members')}
                  containerStyle={{ marginRight: 15 }}
                />
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;