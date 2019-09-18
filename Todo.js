import React, { Component } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Dimensions,
    TextInput,
} from "react-native";

const { width, height } = Dimensions.get("window");


export default class Todo extends Component{
    state={
        isEditing: false,
        isCompleted: false,
        toDoValue: "",
    }
    render(){
        const { text } = this.props;
        const { isCompleted, isEditing, toDoValue } = this.state;
        return(
            <View style={styles.container}>
                <View style={styles.column}>
                <TouchableOpacity onPress={this._toggleComplete}>
                    <View style={[
                        styles.circle, 
                        isCompleted ? styles.completedCircle : styles.uncompletedCircle
                        ]}/>
                </TouchableOpacity>
                {isEditing ? (
                    <TextInput 
                        style={[
                            styles.input, 
                            styles.text,
                            isCompleted ? styles.completedText : styles.uncompletedText
                        ]} 
                        value={toDoValue}
                        multiline={true}
                        onChangeText={this._controllInput}
                    />
                ) : (
                    <Text style={[
                        styles.text, 
                        isCompleted ? styles.completedText : styles.uncompletedText
                        ]} >
                        {text}
                    </Text>
                )}
                </View>
                    {isEditing ? (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._finishEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>✅</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                     : (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._startEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>✏️</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>❌</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            
        );
    }
    _toggleComplete = () => {
        this.setState(prevState => {
            return {
                isCompleted: !prevState.isCompleted
            }
        })
    }
    _startEditing = () => {
        const { text } = this.props;
        this.setState({
            isEditing: true,
            toDoValue: text
        });
    };
    _finishEditing = () => {
        this.setState({
            isEditing: false,
        })
    }
    _controllInput = (text) => {
        this.setState({
            toDoValue: text
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems:"center",
        justifyContent:"space-between",

    },
    circle:{
        width: 35,
        height: 35,
        borderRadius: 25,
        borderColor: "red",
        borderWidth: 4,
        marginRight: 20
    },
    text:{
        fontWeight:"600",
        fontSize: 20,
        marginVertical: 20,
    },
    completedCircle:{
        borderColor: "#bbb"
    },
    uncompletedCircle:{
        borderColor: "#f23657"
    },
    completedText:{
        color: "#bbb",
        textDecorationLine:"line-through"
    },
    uncompletedText:{
        color: "#353839",
    },
    column:{
        flexDirection: "row",
        alignItems: "center",
        width: width/2, 
        justifyContent: "space-between" //양쪽 정렬, space-around: 공백이 있는 양쪽 정렬
    },
    actions:{
        flexDirection: "row",
    },
    actionContainer:{
        marginVertical: 10,
        marginHorizontal: 10, // 손 뚱뚱하니까 근처에서도 감지할 수 있게
    },
    input:{
        marginVertical: 20,
        width: width / 2
    }
});