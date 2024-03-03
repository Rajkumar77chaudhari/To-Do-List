import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

export interface ToDoType {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchToDoList = createAsyncThunk(
  'todo/fetchToDoList',
  async () => {
    try {
      const snapshot = await firestore().collection('todos').get();
      let todos: ToDoType[] = [];

      snapshot.docs.forEach(doc => {
        todos.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return todos;
    } catch (error: any) {
      throw error;
    }
  },
);

export const addToDo = createAsyncThunk(
  'todo/addToDo',
  async (title: string) => {
    try {
      const lastTodoSnapshot = await firestore()
        .collection('todos')
        .orderBy('id', 'desc')
        .limit(1)
        .get();

      let lastId = 0;
      if (!lastTodoSnapshot.empty) {
        const lastTodo = lastTodoSnapshot.docs[0].data();
        lastId = lastTodo.id + 1;
      }

      const todoData: ToDoType = {
        id: lastId,
        title: title,
        completed: false,
        created_at: moment().format('lll'),
        updated_at: '',
      };

      await firestore()
        .collection('todos')
        .doc(todoData.id.toString())
        .set(todoData);

      return todoData;
    } catch (error: any) {
      throw error;
    }
  },
);

export const updateToDo = createAsyncThunk(
  'todo/updateToDo',
  async (todoData: ToDoType) => {
    console.log('====================================');
    console.log(todoData, 'UPDATED');
    console.log('====================================');
    try {
      await firestore()
        .collection('todos')
        .doc(todoData.id.toString())
        .set(todoData);
      return todoData;
    } catch (error: any) {
      throw error;
    }
  },
);

export const deleteToDo = createAsyncThunk(
  'todo/deleteToDo',
  async (id: string) => {
    try {
      const querySnapshot = await firestore()
        .collection('todos')
        .where('id', '==', id)
        .get();
      if (querySnapshot.empty) {
        throw new Error(`Document with id ${id} not found`);
      }

      const docSnapshot = querySnapshot.docs[0];
      await docSnapshot.ref.delete();

      return id;
    } catch (error: any) {
      throw error;
    }
  },
);

export interface initialStateType {
  loading: boolean;
  ToDoList: ToDoType[];
  error: null | string;
}

const initialState: initialStateType = {
  loading: true,
  ToDoList: [],
  error: null,
};

const ToDoListSlice = createSlice({
  name: 'ToDoList',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchToDoList.pending, state => {
      state.loading = true;
    });
    builder.addCase(fetchToDoList.fulfilled, (state, action) => {
      state.loading = false;
      state.ToDoList = action.payload;
    });
    builder.addCase(fetchToDoList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(addToDo.fulfilled, (state, action) => {
      state.ToDoList.push(action.payload);
      state.loading = false;
    });
    builder.addCase(addToDo.pending, state => {
      state.loading = true;
    });

    // Handle rejected state for addToDo
    builder.addCase(addToDo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleteToDo.fulfilled, (state, action) => {
      state.ToDoList = state.ToDoList.filter(
        todo => todo.id !== action.payload,
      );
      state.loading = false;
    });
    builder.addCase(deleteToDo.pending, state => {
      state.loading = true;
    });

    builder.addCase(deleteToDo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateToDo.fulfilled, (state, action) => {
      const index = state.ToDoList.findIndex(
        todo => todo.id === action.payload.id,
      );
      if (index !== -1) {
        state.ToDoList[index] = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(updateToDo.pending, state => {
      state.loading = true;
    });

    builder.addCase(updateToDo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default ToDoListSlice.reducer;
