import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainList from './src/screens/MainList';
import AddToDo from './src/screens/AddToDo';
import {Provider} from 'react-redux';
import {store} from './src/store';

interface AppProps {}

const stack = createNativeStackNavigator();

const App: React.FunctionComponent<AppProps> = props => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <stack.Navigator>
          <stack.Screen
            component={MainList}
            name="ToDoList"
            options={{headerTitle: 'To Do List'}}
          />
          <stack.Screen component={AddToDo} name="AddToDo" />
        </stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
