import React from 'react';
import { ScrollView, StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform} from 'react-native';
import Todo from "./Todo"
import { AppLoading } from 'expo';
import uuidv1 from "uuid/v1";

const { height, width } = Dimensions.get("window");

export default class App extends React.Component{
  state = {
    newTodo: "",
    loadedTodos: false,
    todos:{}
  };
  componentDidMount = () => {
    this._loadToDos();
  };
  render(){
    const { newTodo, loadedTodos, todos } = this.state;
    
    if (!loadedTodos){
      return <AppLoading /> 
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Text style={styles.title}>Coeli's Todo</Text>
        <View style={styles.card}>
          <TextInput 
          style={styles.input} 
          placeholder={"New To Do"} 
          value={newTodo} 
          onChangeText={this._createNewTodo}
          placeholderTextColor={"#999"}
          returnKeyType={"done"}
          autoCorrect={false}
          onSubmitEditing={this._addTodo} // when I click "done"
          />
          <ScrollView contentContainerStyle={styles.todos}>
            {Object.values(todos).map(todo => <Todo key={todo.id}{...todo} 
            deleteTodo={this._deleteTodo}/>)}
          </ScrollView>
        </View>
      </View>
    );
  }
  _createNewTodo = text => {
    this.setState({
      newTodo: text
    });
  }
  _loadToDos = () => {
    this.setState({
      loadedTodos: true
    });
  };
  _addTodo = ()=>{
    const { newTodo } = this.state;
    if( newTodo != "" ){
      this.setState({
        newTodo: "",
      });
      this.setState(prevState => {
        const ID = uuidv1();
        const newTodoObject = {
          [ID]:{
            id: ID,
            isCompleted: false,
            text: newTodo,
            createdAt: Date.now()
          }
        }
        const newState = {
          ...prevState,
          newTodo: "",
          todos:{
            ...prevState.todos,
            ...newTodoObject
          }
        }
        return {...newState};
      });
    }
  }

  _deleteTodo = (id) =>{
    this.setState(prevState => {
        const todos = prevState.todos;
        delete todos[id];
        const newState = {
            ...prevState,
            ...todos
        }
        return {...newState};
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center',
  },
  title:{
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight:"200",
    marginBottom: 30,

  },
  card:{
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios:{
        shadowColor:"rgb(50,50,50)",
        shadowOpacity:0.5,
        shadowRadius: 5,
        shadowOffset:{
          height: -1,
          width: 0
        }
      },
      android:{
        elevation:3
      }
    })
  },
  input:{
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  todos:{
    alignItems: "center"
  }
});
