import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './constant';
import {update} from '../utils/reduxStore/reducer';
import {useDispatch, useSelector} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import InfoFilling from '../screens/InfoFilling';
// import Settings from '../screens/Settings';
import SettingStack from './SettingStack';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StatusBar} from 'react-native';
const NativeStack = createNativeStackNavigator();
const BottomStack = createBottomTabNavigator();
export default function HomeRouting() {
  const {updated} = useSelector(state => state.userInfo);
  // console.log(updated, 'updated');
  return !updated ? (
    <NativeStack.Navigator>
      <NativeStack.Screen
        name={ROUTES.INFOFILLING}
        component={InfoFilling}
        options={{
          // headerBackTitleVisible: false, // iOS上隐藏返回按钮旁边的文本
          headerTransparent: true,
          headerTitle: 'Basic Information', // 不显示标题
          // headerLeft: () => null, // 隐藏左侧组件
          // headerRight: () => null, // 隐藏右侧组件
        }}
      />
    </NativeStack.Navigator>
  ) : (
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
          component={Home}
          options={{
            headerStyle: {
              backgroundColor: 'rgba(63, 43, 190, 0.22)',
              // backgroundColor: 'red',
            },
            headerTitle: 'Team Up now!',
            tabBarLabel: 'Chat',
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
            // headerStyle: {
            //   backgroundColor: 'rgba(63, 43, 190, 0.22)',

            //   // backgroundColor: 'white',

            //   elevation: 0, // For Android: Remove shadow
            // },
            // headerTitle: 'Team Up now!!',
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
