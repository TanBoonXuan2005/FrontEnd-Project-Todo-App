import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        createTodo: (state, action) => {
            const newTodo = {
                id: Date.now(),
                completed: false,
                ...action.payload,
            }
            state.push(newTodo);
        },
        updateTodo: (state, action) => {
            const index = state.findIndex(todo => todo.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteTodo: (state, action) => {
            return state.filter(todo => todo.id !== action.payload);
        },
        toggleComplete: (state, action) => {
            const index = state.findIndex(todo => todo.id === action.payload);
            if (index !== -1) {
                state[index].completed = !state[index].completed;
            }
        },
    },
});

export const { createTodo, updateTodo, deleteTodo, toggleComplete } = todosSlice.actions;

export default todosSlice.reducer;