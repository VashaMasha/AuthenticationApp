import React, { Component } from 'react';
import { 
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { setBiometricsAction }from '../actions/PinActions';
import { showMessage } from 'react-native-flash-message';
import Colors from '../src/Colors';
import ReactNativeBiometrics from 'react-native-biometrics';
import Icon from 'react-native-vector-icons/Ionicons';

export class BiometricsScreen extends Component {
    state = {
        biometricsCancelled: false,
        isFetching: false
    }

    biometrics() {
        if (this.state.biometricsCancelled) {
            return;
        }
        ReactNativeBiometrics.isSensorAvailable().then(({available}) => {
            if (available) {
                ReactNativeBiometrics.simplePrompt({ promptMessage: "Добавить биометрию"})
                .then((res) => {
                    this.setState({biometricsCancelled: true});
                    this.setState({isFetching: true})
                    setTimeout(() => {
                        this.props.setBiometricsAction()
                        this.setState({isFetching: false})
                        this.props.navigation.navigate("Home")
                    }, 2000);
                })
                .catch((err) => {
                    showMessage({
                        message: "Не удалось активировать биометрическую аутентификацию",
                        type: "error",
                    });
                });
            } else {
                this.setState({biometricsCancelled: true});
            }
        }).catch((err) => {
            showMessage({
                message: "Не удалось определить наличие биометрических сенсоров",
                type: "error",
            });
        });
    }
    
    yes = () => {
        this.biometrics()
    }

    render() {
        const { isFetching } = this.state
        return (
            <View style={isFetching ? styles.disabledContainer : styles.container}>
                {isFetching &&
                    <View style={styles.loader}>
                        <ActivityIndicator size='large' color={Colors.blue} animating={true}/>
                    </View>
                }
                <View style={styles.containerText}>
                    <Icon name='finger-print-outline' size={100} color={Colors.lightBlue}></Icon>
                    <Text style={styles.header}>Биометрия</Text>
                    <Text style={styles.subtext}>Подключите авторизацию по биометрии, чтобы не вводить код доступа</Text>
                </View>
                <View style={styles.containerButtons}> 
                    <TouchableOpacity style={styles.yesButton} onPress={() => this.yes()} disabled={isFetching}>
                        <Text style={styles.yesText}>Подключить биометрию</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.noButton} onPress={() => this.props.navigation.navigate("Home")} disabled={isFetching}>
                        <Text style={styles.noText}>Не сейчас</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 50,
        flexDirection: 'column'
    },
    disabledContainer: {
        flex: 1,
        paddingHorizontal: 50,
        flexDirection: 'column',
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
        fontSize: 24,
        fontWeight: "bold",
        paddingTop: 20
    },
    subtext: {
        fontSize: 16,
        color: Colors.darkerGray,
        textAlign: 'center',
        paddingTop: 20
    },
    containerText: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    containerButtons: {
        flex: 1,
        justifyContent: 'center'
    },
    yesButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lightBlue,
        borderRadius: 30,
        height: 50,
        marginTop: 30,
        marginHorizontal: 50
    },
    noButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderColor: Colors.lightBlue,
        borderWidth: 2,
        borderRadius: 30,
        height: 50,
        marginTop: 30,
        marginHorizontal: 50
    },
    yesText: {
        color: Colors.white
    },
    noText: {
        color: Colors.lightBlue
    }
 });

 const mapStateToProps = (state) => {
    return {
        pin: state.pin
    };
};

const mapDispatchToProps = {
    setBiometricsAction
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BiometricsScreen);