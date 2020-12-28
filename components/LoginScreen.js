import React, { Component } from 'react';
import { 
    ActivityIndicator,
    TextInput, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import Colors from '../src/Colors';
import { login } from '../actions/AuthActions';

export class LoginScreen extends Component {    
    state = {
        email: this.props.email || '',
        password: ''
    }

    emailChange = (text) => {
        this.setState({
            email: text
        });
    }

    passwordChange = (text) => {
        this.setState({
            password: text
        });
    }

    loginButtonPress() {
        const { email, password } = this.state
        const { login } = this.props
        if (email.length && password.length) {
            login()
        }
    }
    
    render() {
        const { isFetching } = this.props.auth
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                    {isFetching &&
                        <View style={styles.loader}>
                            <ActivityIndicator size='large' color={Colors.blue} animating={true}/>
                        </View>
                    }
                    <View style={isFetching ? styles.disabledContainer : styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Авторизация</Text>
                        </View>
                        <View style={styles.loginFormContainer}>
                            <TextInput 
                                disabled={isFetching}
                                placeholder='Ваша рабочая почта' 
                                autoCapitalize='none' 
                                textContentType='emailAddress'
                                style={styles.textInput}
                                value={this.state.email}
                                onChangeText={this.emailChange}>
                            </TextInput>
                            <TextInput
                                disabled={isFetching}
                                placeholder='Пароль от рабочего компьютера' 
                                textContentType='password' 
                                secureTextEntry={true} 
                                clearTextOnFocus={true}
                                style={styles.textInput}
                                value={this.state.password}
                                onChangeText={this.passwordChange}>
                            </TextInput>
                            <TouchableOpacity style={isFetching ? [styles.button, styles.disabled] : styles.button} onPress={() => this.loginButtonPress()} disabled={isFetching}>
                                <Text style={styles.buttonText}>Войти</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    disabledContainer: {
        flex: 1,
        opacity: 0.2
    },
    loader: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 150
    },
    headerText: {
        fontSize: 40,
        fontWeight: "bold"
    },
    loginFormContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        marginHorizontal: 30
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.blue,
        borderRadius: 30,
        height: 50,
        marginTop: 30,
        marginHorizontal: 50
    },
    disabled: {
        opacity: 0.5
    },
    buttonText: {
        color: Colors.white,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    textInput: {
        fontSize: 20,
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 5,
        padding: 10
    }
 });

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = {
    login
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginScreen);