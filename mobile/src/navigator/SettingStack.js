import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './constant';
import Settings from '../screens/Settings';
import BasicInfo from '../screens/BasicInfo';
import Preference from '../screens/Preference';

const SettingStack = createNativeStackNavigator();

export default function SettingStackNavigator() {
  return (
    <SettingStack.Navigator
      screenOptions={{
        // Customize your header here
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: 'rgba(63, 43, 190, 0.22)',
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          // styles for the title
        },
      }}>
      <SettingStack.Screen name={ROUTES.SETTINGS} component={Settings} />
      <SettingStack.Screen name={ROUTES.BASICINFO} component={BasicInfo} />

      <SettingStack.Screen name={ROUTES.PREFERENCE} component={Preference} />
      <SettingStack.Screen name={ROUTES.RESETPASSWORD} component={Preference} />
    </SettingStack.Navigator>
  );
}
