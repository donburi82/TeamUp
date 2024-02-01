import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './constant';
import Settings from '../screens/Settings';
import BasicInfo from '../screens/BasicInfo';
import Preference from '../screens/Preference';
import ResetPassword from '../screens/ResetPassword';
import ChangeMajor from '../screens/ChangeMajor';
import ChangeYear from '../screens/ChangeYear';
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

      <SettingStack.Screen
        name={ROUTES.PREFERENCE}
        component={Preference}
        options={{headerTitle: 'Group Preference Information'}}
      />
      <SettingStack.Screen
        name={ROUTES.RESETPASSWORD}
        component={ResetPassword}
        options={{headerTitle: 'Reset Password'}}
      />
      <SettingStack.Screen
        name={ROUTES.CHANGEYEAR}
        component={ChangeYear}
        options={{headerTitle: ROUTES.CHANGEYEAR}}
      />
      <SettingStack.Screen
        name={ROUTES.CHANGEMAJOR}
        component={ChangeMajor}
        options={{headerTitle: 'Major'}}
      />
    </SettingStack.Navigator>
  );
}
