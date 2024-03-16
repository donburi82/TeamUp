import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './constant';
import ChatHome from '../screens/ChatHome';

import ChatRoom from '../screens/ChatRoom';
import OtherUserInfo from '../screens/OtherUserInfo';
import {View, Text} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Platform} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
const ChatStack = createNativeStackNavigator();

export default function ChatStackNavigator() {
  return (
    <ChatStack.Navigator
      screenOptions={{
        // Customize your header here
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor:
            Platform.OS == 'ios' ? '#f0f0f0' : 'rgba(63, 43, 190, 0.22)',
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          // styles for the title
        },
      }}>
      <ChatStack.Screen
        name={ROUTES.CHATHOME}
        component={ChatHome}
        options={{
          title: 'Chat',
        }}
      />
      <ChatStack.Screen
        name={ROUTES.CHATROOM}
        component={ChatRoom}
        options={({route}) => ({
          headerTitle: () => <ChatRoomHeader id={route.params?.title} />,
          // headerBackTitleVisible: false,
          headerRight: () => (
            <EntypoIcon name="dots-three-horizontal" size={30} color="black" />
          ),
        })}
      />
      <ChatStack.Screen name={ROUTES.OTHERUSERINFO} component={OtherUserInfo} />
    </ChatStack.Navigator>
  );
}

function ChatRoomHeader() {
  const route = useRoute();
  const title = route?.params?.title;
  return (
    <View>
      <Text style={{fontSize: 24, fontWeight: 800, color: 'black'}}>
        {title}
      </Text>
    </View>
  );
}
