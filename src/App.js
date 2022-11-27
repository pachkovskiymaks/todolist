import React, {useEffect, useState} from 'react';
import './App.css';
import Header from './components/Header/Header';
import AddTodo from './components/AddTodo/AddTodo';
import TodoList from './components/TodoList/TodoList';
import axios from "axios";
import {Container} from 'react-bootstrap';

function App() {
    const API_KEY = 'cade0f15-cd1b-49e7-a3a1-852759cddc70'
    const [todo, setTodo] = useState([])
    const [todoListId, setTodoListId] = useState(null)

    function authorize(email, password) {
        return axios.post('https://social-network.samuraijs.com/api/1.1/auth/login', {
            email,
            password,
        }, {
            withCredentials: true,
            headers: {
                'API-KEY': API_KEY
            }
        }).then(() => {
            getAllToDoLists()
        }).catch((error) => {
            console.error(error);
        });
    }

    function getAllToDoLists() {
        axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', {
            withCredentials: true,
            headers: {
                'API-KEY': API_KEY
            }
        })
            .then((response) => {
                setTodoListId(response.data[0].id)
                getAllTasks(response.data[0].id)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function getAllTasks(todoListId) {
        axios.get(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todoListId}/tasks`, {
            withCredentials: true,
            headers: {
                'API-KEY': API_KEY
            }
        }).then((response) => {
            setTodo(response.data.items)
        }).catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        authorize('lvivskiy.maks@gmail.com', '12345678')
    }, [])


    let fetchToDo = (value) => {
        setTodo(
            [value, ...todo]
        )
    };
    return (
        <Container>
            <Header/>
            <TodoList todo={todo} setTodo={setTodo} apiKey={API_KEY}/>
            <AddTodo todoListId={todoListId} apiKey={API_KEY} todo={todo} setTodo={fetchToDo}/>
        </Container>
    );
}

export default App;
