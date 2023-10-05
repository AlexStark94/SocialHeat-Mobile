import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import CameraScreen from '../screens/CameraScreen';
import SiteScreen from '../screens/SiteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Text } from 'react-native-paper';

const Tab = createBottomTabNavigator();

export default function HomeStack() {
  return (
    <View style={{ flex: 1, borderRadius: 20, backgroundColor: '#FFFFFFFF' }}>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          tabBarInactiveTintColor: '#9DB2CE',
          tabBarActiveTintColor: '#FF774B',
        }}
        screenOptions={({ route }) => ({
          tabBarStyle: { 
            height: 80, 
            borderTopStartRadius: 20, 
            borderTopEndRadius: 20, 
            borderTopColor: '#EBEBEB', 
            borderTopWidth: 1 
          },
          headerShown: false,
          tabBarLabel: route.name,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Search':
                iconName = 'magnify';
                break;
              case 'Camera':
                iconName = 'camera-outline';
                break;
              case 'Site':
                iconName = 'map-marker';
                break;
              case 'Profile':
                iconName = 'account';
                break;
              default:
                iconName = 'home';
            }

            const iconColor = focused ? '#FF774B' : '#9DB2CE';
            const labelColor = focused ? '#FF774B' : '#9DB2CE';

            return (
              iconName !== 'camera-outline' ?
                <View style={{ position: 'relative', height: 80, alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name={iconName}
                    color={iconColor}
                    size={24}
                  />
                  <Text style={{ color: labelColor, width: '100%' }}>
                    {route.name}
                  </Text>
                </View>
                :
                <View style={{ position: 'relative' }}>
                  <View 
                    style={{
                      backgroundColor: 'white',
                      height: 100,
                      width: 100,
                      position: 'absolute',
                      bottom: -20,
                      right: -45,
                      borderRadius: 50,
                      borderTopColor: '#EBEBEB',
                      borderTopWidth: 1
                    }}
                  >
                    <View
                      style={{
                        height: 90,
                        width: 90,
                        backgroundColor: '#FFDDA9DD',
                        
                        borderRadius: 50,
                        margin: 5
                      }}>
                      <View
                        style={{
                          height: 74,
                          width: 74,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#EF5C2E',
                          borderRadius: 50,
                          margin: 8
                        }}
                      >
                        <MaterialCommunityIcons
                          name={iconName}
                          color={"white"}
                          size={28}
                        />
                      </View>
                    </View>
                  </View>
                </View>
            );
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: '',
          }}
        />
        <Tab.Screen
          name="Search"
          component={ChatScreen}
          options={{
            tabBarLabel: '',
          }}
        />
        <Tab.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            tabBarLabel: '',
          }}
        />
        <Tab.Screen
          name="Site"
          component={SiteScreen}
          options={{
            tabBarLabel: '',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: '',
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
