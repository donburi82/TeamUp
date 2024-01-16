import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './constant';
import ChatHome from '../screens/ChatHome';
import Settings from '../screens/Settings';

const ChatStack = createNativeStackNavigator();

export default function ChatStackNavigator() {
  return (
    <ChatStack.Navigator
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
      <ChatStack.Screen name={ROUTES.CHATHOME} component={ChatHome} />
      <ChatStack.Screen name={ROUTES.CHATROOM} component={ChatHome} />
    </ChatStack.Navigator>
  );
}
