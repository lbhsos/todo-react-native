import React from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  TextInput, 
  Dimensions, 
  Platform,
  AsyncStorage
} from 'react-native';
import Todo from "./Todo"
import { AppLoading } from 'expo';
import uuidv1 from "uuid/v1";



const { height, width } = Dimensions.get("window");

export default class App extends React.Component{
  // think state just like database
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
    //console.log(todos);
    
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
            {Object.values(todos)
            .reverse()
            .map(todo => <Todo key={todo.id}{...todo} 
            deleteTodo={this._deleteTodo}
            uncompleteTodo={this._uncompleteTodo}
            completeTodo={this._completeTodo}
            updateTodo={this._updateTodo}
          />)}
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
  _loadToDos = async () => {
    try{
      //'await' means _loadToDos function waits for getItem
      const todos = await AsyncStorage.getItem("todos");
      const parsedTodos = JSON.parse(todos);
      console.log(todos);
      this.setState({
        loadedTodos: true,
        todos:parsedTodos || {}
      });
    }catch(err){
      console.log(err);
    }
    
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
        this._saveTodos(newState.todos);
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
        this._saveTodos(newState.todos);
        return {...newState};
    });
  }
  _uncompleteTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos:{
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: false
          }
        }
      }
      this._saveTodos(newState.todos);
      return {...newState};
    });
  }
  _completeTodo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos:{
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: true
          }
        }
      }
      this._saveTodos(newState.todos);
      return {...newState};
    });
  };
  _updateTodo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos:{
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            text: text
          }
        }
      }
      this._saveTodos(newState.todos);
      return {...newState};
    });
  }
  _saveTodos = (newTodos) => {
    // asyncstorage is make to save strings 
    // we have to turn our object to string
    // asyncstorage {key: value}
    const saveTodos = AsyncStorage.setItem("todos", JSON.stringify(newTodos));
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
