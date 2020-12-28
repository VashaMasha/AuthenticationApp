import React, { Component } from 'react';
import { 
    Text,
    StyleSheet,
    View
} from 'react-native';

export class HomeScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.containerText}>Welcome!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerText: {
        fontSize: 40,
        fontWeight: "bold"
    }
 });


export default HomeScreen;