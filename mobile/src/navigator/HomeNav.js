import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './constant';
import {update} from '../utils/reduxStore/reducer';
import {useDispatch, useSelector} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import InfoFilling from '../screens/InfoFilling';
// import Settings from '../screens/Settings';
import SettingStack from './SettingStack';
import ChatStackNavigator from './ChatStack';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StatusBar} from 'react-native';
const NativeStack = createNativeStackNavigator();
const BottomStack = createBottomTabNavigator();
export default function HomeRouting() {
  return (
    <>
      <StatusBar backgroundColor="rgba(63, 43, 190, 0.26)" />
      <BottomStack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          tabBarStyle: {
            margin: 10,
            borderRadius: 10,
          },
        }}
        tabBarOptions={{
          activeTintColor: '#3f2bbe',
        }}>
        <BottomStack.Screen
          name={ROUTES.HOME}
          component={Home}
          options={{
            headerStyle: {
              backgroundColor: 'rgba(63, 43, 190, 0.22)',
            },
            headerTitle: 'Team Up now!',
            tabBarLabel: 'Users',
            tabBarIcon: ({focused, color, size}) => (
              <EntypoIcon
                name="user"
                color={color}
                size={focused ? size * 1.25 : size}
              />
            ),
          }}
        />
        <BottomStack.Screen
          name={ROUTES.GROUPS}
          component={Home}
          options={{
            headerStyle: {
              backgroundColor: 'rgba(63, 43, 190, 0.22)',
              // backgroundColor: 'red',
            },
            headerTitle: 'Team Up now!',
            tabBarLabel: 'Groups',
            tabBarIcon: ({focused, color, size}) => (
              <EntypoIcon
                name="users"
                color={color}
                size={focused ? size * 1.25 : size}
              />
            ),
          }}
        />
        <BottomStack.Screen
          name={ROUTES.CHAT}
          component={ChatStackNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({focused, color, size}) => (
              <EntypoIcon
                name="chat"
                color={color}
                size={focused ? size * 1.25 : size}
              />
            ),
          }}
        />
        <BottomStack.Screen
          name={ROUTES.SETTINGS}
          component={SettingStack}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size, focused}) => (
              <Ionicons
                name="settings-sharp"
                size={focused ? size * 1.25 : size}
                color={color}
              />
            ),
          }}
        />
      </BottomStack.Navigator>
    </>
  );
}
