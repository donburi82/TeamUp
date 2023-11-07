import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "./constant";

import LoginScreen from "../screens/LoginScreen";
import SetupScreen from "../screens/SetupScreen";

const AuthStack = createNativeStackNavigator()

export default function AuthRouting(){
    return <AuthStack.Navigator initialRouteName={ROUTES.LOGIN}>
        <AuthStack.Screen name={ROUTES.LOGIN} component={LoginScreen} options={{headerShown:false}}/>
        <AuthStack.Screen name={ROUTES.EMAILVERIFICATION} component={SetupScreen} 
        options={{
            // headerBackTitleVisible: false, // iOS上隐藏返回按钮旁边的文本
            headerTransparent:true,
            headerTitle: '', // 不显示标题
            headerLeft: () => null, // 隐藏左侧组件
            headerRight: () => null, // 隐藏右侧组件
          }}
        />

      
        </AuthStack.Navigator>
}