import React, {Component} from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native';
import { 
    Circle,
    Svg 
} from 'react-native-svg';
import { connect } from 'react-redux';
import ReactNativeBiometrics from 'react-native-biometrics';
import { showMessage } from 'react-native-flash-message';
import { getPin, setPin } from '../actions/PinActions';
import Colors from '../src/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const MODE_SET = 'MODE_SET';
const MODE_VERIFY = 'MODE_VERIFY';
const MODE_AUTH = 'MODE_AUTH';

const emptyPin = [0, 0, 0, 0];

export class PinScreen extends Component {
    state = {
        mode: this.props.pin.set ? MODE_AUTH : MODE_SET,
        currentPin: [],
        prevPin: [],
        verifyError: false,
        biometricsCancelled: false
    }

    biometrics() {
        if (this.state.biometricsCancelled) {
            return;
        }
        const { mode } = this.state;
        if (mode == MODE_AUTH) {
            ReactNativeBiometrics.isSensorAvailable().then(({available}) => {
                if (available) {
                    ReactNativeBiometrics.simplePrompt({ promptMessage: "Войти в приложение"})
                    .then((res) => {
                        this.setState({biometricsCancelled: true});
                        this.props.navigation.navigate("Home")
                    })
                    .catch((err) => {
                        showMessage({
                            message: "Проверка биометрии не пройдена",
                            type: "error",
                            color: Colors.white,
                            backgroundColor: Colors.red
                        });
                    });
                } else {
                    this.setState({biometricsCancelled: true});
                }
            }).catch((err) => {
                showMessage({
                    message: "Не удалось определить наличие биометрических сенсоров",
                    type: "error",
                    color: Colors.white,
                    backgroundColor: Colors.red
                });
            });
        }
    }
    
    render() {
        if (this.props.pin.useBiometrics) {
            this.biometrics();
        }
        return (
            <View style={styles.container}>
                <View style={styles.pinContainer}>
                    <View style={styles.topLabels}>
                        <Text style={styles.header}>{this.mainText()}</Text>
                        {this.state.verifyError && 
                            <Text style={styles.error}>Пароли не совпадают</Text>
                        }
                        {!this.state.verifyError &&
                            <Text style={styles.sub}>{this.subText()}</Text>
                        }
                    </View>
                    <View style={styles.pinPlaceholders}>
                        {emptyPin.map((p, i) => this.pinPlaceholder(i, this.state.currentPin[i]))}
                    </View>
                    <View style={styles.buttonRow}>
                        {this.pinButton(1)}
                        {this.pinButton(2)}
                        {this.pinButton(3)}
                    </View>
                    <View style={styles.buttonRow}>
                        {this.pinButton(4)}
                        {this.pinButton(5)}
                        {this.pinButton(6)}
                    </View>
                    <View style={styles.buttonRow}>
                        {this.pinButton(7)}
                        {this.pinButton(8)}
                        {this.pinButton(9)}
                    </View>
                    <View style={styles.buttonRow}>
                        <View style={styles.buttonPlaceholder}>
                            <TouchableOpacity onPress={() => this.pinCancel()}>
                                <Text style={styles.buttonCancelText}>Отмена</Text>
                            </TouchableOpacity>
                        </View>
                        {this.pinButton(0)}
                        <View style={styles.buttonPlaceholder}>
                            { this.state.currentPin.length > 0 && 
                                <TouchableOpacity onPress={() => this.pinRemove()}>
                                    <Icon name="arrow-back" size={40} color={Colors.blue}></Icon>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    mainText() {
        switch (this.state.mode) {
            case MODE_AUTH:
                return "Введите код доступа";
            case MODE_SET:
                return "Придумайте код доступа";
            case MODE_VERIFY:
                return "Повторите код доступа";
        }
    }

    subText() {
        switch (this.state.mode) {
            case MODE_AUTH:
                return "";
            case MODE_SET:
                return "Он будет использоваться для каждого входа в приложение";
            case MODE_VERIFY:
                return "";
        }
    }

    pinAdd(num) {
        var { currentPin, mode, prevPin, verifyError } = this.state;
        if (verifyError) {
            verifyError = false;
            this.setState({verifyError});
        }
        if (currentPin.length < emptyPin.length) {
            currentPin.push(num);
            this.setState({ currentPin });
            if (currentPin.length == emptyPin.length) {
                switch (mode) {
                    case MODE_AUTH:
                       getPin()
                            .then(({password}) => {
                                if (password == currentPin.toString()) {
                                    this.props.navigation.navigate('Home')
                                } 
                                else {
                                    currentPin = [];
                                    this.setState({currentPin});
                                }
                            })
                            .catch((err) => console.error(err));
                        break;
                    case MODE_SET:
                        mode = MODE_VERIFY;
                        prevPin = currentPin.slice();
                        currentPin = [];
                        this.setState({ currentPin, prevPin, mode });
                        break;
                    case MODE_VERIFY:
                        var success = true;
                        for (var i = 0; i < currentPin.length; i++) {
                            if (currentPin[i] != prevPin[i]) {
                                success = false;
                                break;
                            }
                        }
                        if (success) {
                            this.props.setPin(currentPin.toString())
                                .then((data) => {
                                    this.props.navigation.navigate('Biometrics')
                                })
                                .catch((err) => console.error(err));
                        } 
                        else {
                            mode = MODE_SET;
                            currentPin = [];
                            prevPin = [];
                            verifyError = true;
                            this.setState({ mode, currentPin, prevPin, verifyError });
                        }
                        break;
                }
            }
        }
    }

    pinRemove() {
        var { currentPin } = this.state
        if (currentPin.length > 0) {
            currentPin.pop();
            this.setState(this.state);
        }
    }

    pinCancel() {
        var { currentPin } = this.state
        if (currentPin.length > 0) {
            currentPin.splice(0, currentPin.length)
            this.setState(this.state);
        }
    }

    pinButton(num) {
        return (
            <TouchableOpacity style={[styles.button, styles.buttonPlaceholder]} onPress={() => this.pinAdd(num)}>
                <Text style={styles.buttonText}>{num}</Text>
            </TouchableOpacity>
        );
    }

    pinPlaceholder(key, state) {
        return (
            <Svg height="20" width="20" key={key}>
              <Circle cx="10" cy="10" r="10" fill={Colors.lightBlue} />
              <Circle cx="10" cy="10" r="9" fill={state != undefined ? Colors.lightBlue : Colors.white} />
            </Svg>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    pinContainer: {
        height: 580,
        width: 300,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    buttonRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10
    },
    button: {
        borderWidth: 1,
        borderColor: Colors.lightBlue,
        alignItems: 'center',
        borderRadius: 40
    },
    buttonText: {
        fontSize: 30,
        color: Colors.blue
    },
    buttonCancelText: {
        fontSize: 16,
        color: Colors.blue
    },
    buttonPlaceholder: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pinPlaceholders: {
        flexDirection: 'row',
        marginLeft: 75,
        marginRight: 75,
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 10
    },
    topLabels: {
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1
    },
    header: {
        fontSize: 20,
    },
    sub: {
        textAlign: 'center',
        marginTop: 10
    },
    error: {
        color: 'red'
    }
});

const mapStateToProps = state => {
    return {
        pin: state.pin
    };
};

const mapDispatchToProps = {
    getPin,
    setPin
};

export default connect(mapStateToProps, mapDispatchToProps)(PinScreen);