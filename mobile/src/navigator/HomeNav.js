import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from './constant';

import Home from '../screens/Home';
import InfoFilling from '../screens/InfoFilling';

const HomeStack = createNativeStackNavigator();

export default function HomeRouting() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={ROUTES.HOME}
        component={Home}
        options={{headerTitle: 'Team Up now!'}}
      />
      <HomeStack.Screen
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
    </HomeStack.Navigator>
  );
}
