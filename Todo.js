import React, { Component } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Dimensions,
    TextInput,
} from "react-native";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");


export default class Todo extends Component{
    constructor(props){
        super(props);
        this.state = {isEditing: false, toDoValue: props.text};
    }
    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteTodo: PropTypes.func.isRequired,
        uncompleteTodo: PropTypes.func.isRequired,
        completeTodo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        updateTodo: PropTypes.func.isRequired,
    }
    state={
        isEditing: false,
        toDoValue: "",
    }
    render(){
        const { isEditing, toDoValue } = this.state;
        const { text, id, deleteTodo, isCompleted } = this.props;
        
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
                            styles.text,
                            styles.input,
                            isCompleted ? styles.completedText : styles.uncompletedText
                        ]} 
                        value={toDoValue}
                        multiline={true}
                        onChangeText={this._controllInput}
                        returnKeyType={"done"}
                        onBlur={this._finishEditing} // when I tab outside
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
                            <TouchableOpacity onPressOut={()=> deleteTodo(id)}>
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
        const { isCompleted, uncompleteTodo, completeTodo, id } = this.props;
        if(isCompleted){
            uncompleteTodo(id)
        } else {
            completeTodo(id)
        }
    }
    _startEditing = () => {
        this.setState({
            isEditing: true,
        });
    };
    _finishEditing = () => {
        const { toDoValue } = this.state;
        const { id, updateTodo } = this.props;
        updateTodo(id, toDoValue);
        this.setState({
            isEditing: false,
        });
    };
    _controllInput = (text) => {
        this.setState({
            toDoValue: text
        });
    };
    
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
        
    },
    actions:{
        flexDirection: "row",
    },
    actionContainer:{
        marginVertical: 10,
        marginHorizontal: 10, // 손 뚱뚱하니까 근처에서도 감지할 수 있게
    },
    input:{
        marginVertical: 15,
        width: width / 2,
        paddingBottom: 5
    }
});