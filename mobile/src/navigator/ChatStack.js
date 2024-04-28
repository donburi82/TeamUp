import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './constant';
import ChatHome from '../screens/ChatHome';

import ChatRoom from '../screens/ChatRoom';
import OtherUserInfo from '../screens/OtherUserInfo';
import {View, Text, TouchableOpacity} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Platform} from 'react-native';
import GroupInfo from '../screens/GroupInfo';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {HeaderBackButton} from '@react-navigation/elements';
const ChatStack = createNativeStackNavigator();

export default function ChatStackNavigator({navigation}) {
  return (
    <ChatStack.Navigator
      // initialRouteName={ROUTES.GroupInfo}
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
          headerTitle: () => <ChatRoomHeader title={route.params?.title} />,
          // 砍掉这个功能好了，有点麻烦
          // headerRight: () =>
          //   route.params?.isGroup ? (
          //     <TouchableOpacity
          //       onPress={() => {
          //         // title: group?.project,
          //         // groupId: group?._id,
          //         // myGroup: mode === 'my',
          //         // chatRoomID: group?.chatRoomID,
          //         console.log(
          //           'chatroom navigation to groupInfo',
          //           route.params?.groupId,
          //         );
          //         navigation.navigate(ROUTES.GroupInfo, {
          //           // 从chatRoomItem 过来的话这几个route的参数都可以拿到，如果是
          //           myGroup: true,
          //           groupId: route.params?.groupId, // this is chatroom id i need group
          //           title: route.params?.title,
          //           isFromChatRoom: true,
          //         });
          //       }}>
          //       <EntypoIcon
          //         name="dots-three-horizontal"
          //         size={30}
          //         color="black"
          //       />
          //     </TouchableOpacity>
          //   ) : null,
        })}
      />
      {/* <ChatStack.Screen
        name={ROUTES.GroupInfo}
        component={GroupInfo}
        options={({route}) => ({
          headerTitle: () => ChatRoomHeader({passedTitle: route.params?.title}),
          
         
        })}
      
      /> */}
      <ChatStack.Screen name={ROUTES.OTHERUSERINFO} component={OtherUserInfo} />
    </ChatStack.Navigator>
  );
}

function ChatRoomHeader({passedTitle}) {
  const route = useRoute();
  const title = route?.params?.title;
  return (
    <View>
      <Text style={{fontSize: 24, fontWeight: 800, color: 'black'}}>
        {passedTitle || title}
      </Text>
    </View>
  );
}
