import {configureStore} from '@reduxjs/toolkit';
import ToDoReducer from './TodoSlice';

export const store = configureStore({
  reducer: {Todo: ToDoReducer},
});
