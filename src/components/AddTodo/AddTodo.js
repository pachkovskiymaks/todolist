import React, {useState} from "react";
import {Button, Col, FormControl, Row} from 'react-bootstrap'
import s from './AddTodo.module.css'
import axios from "axios";

function AddTodo({setTodo, todoListId, apiKey}) {

    const [value, setValue] = useState('')

    function saveTodo() {
        if (value) {
            axios.post(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todoListId}/tasks`, {
                title: value,
                status: 1,
            }, {
                withCredentials: true,
                headers: {
                    'API-KEY': apiKey
                }
            })
                .then((response) => {
                    setTodo(response.data.data.item)
                })
                .catch((error) => {
                    console.error(error);
                });
            setValue('')
        }
    }

    return (
        <Row>
            <Col className={s.addTodoForm}>
                <FormControl placeholder="Enter task" value={value} onChange={(e) => setValue(e.target.value)}
                             className={s.addTodoForm}/>
                <Button onClick={saveTodo} className={s.btn}>Save</Button>
            </Col>
        </Row>
    )
}

export default AddTodo;
