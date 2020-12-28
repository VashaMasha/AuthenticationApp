import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import FlashMessage  from 'react-native-flash-message';
import LoginScreen from './LoginScreen';
import PinScreen from './PinScreen';
import HomeScreen from './HomeScreen';
import BiometricsScreen from './BiometricsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from '../src/Colors';

const Stack = createStackNavigator();

const Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: Colors.white
    }
};

class RootNavigator extends Component {
    render() {
        const { auth } = this.props
        return (
            <View style={{flex:1}}>
                <NavigationContainer theme={Theme}>
                     <Stack.Navigator>
                         {auth.success ? (
                            <>
                                <Stack.Screen 
                                    name="Pin" 
                                    component={PinScreen} 
                                    options={{ 
                                        headerShown: false, 
                                        gestureEnabled: false}}
                                />
                                <Stack.Screen 
                                    name="Biometrics" 
                                    component={BiometricsScreen} 
                                    options={{ 
                                        headerShown: false,
                                        gestureEnabled: false}}
                                />
                                <Stack.Screen 
                                    name="Home" 
                                    component={HomeScreen} 
                                    options={{ 
                                        headerShown: false,
                                        gestureEnabled: false}}
                                />
                            </>
                            ) : (
                                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
                            )
                         }
                        </Stack.Navigator>
                </NavigationContainer>
                <FlashMessage position="top" icon="auto" style={{borderBottomRightRadius: 20, borderBottomLeftRadius: 20}} />
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
       auth: state.auth
    };
};

const mapDispatchToProps = {
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RootNavigator);