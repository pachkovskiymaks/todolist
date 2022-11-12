import React, { useState } from "react";
import { v1 as uuidv1 } from 'uuid';
import { Row, Col, Button, FormControl } from 'react-bootstrap'
import s from './AddTodo.module.css'

function AddTodo({ todo, setTodo }) {

    const [value, setValue] = useState('')

    function saveTodo() {
        if (value) {
            setTodo(
                [...todo, {
                    id: uuidv1(),
                    title: value,
                    status: true
                }]
            )
            setValue('')
        }
    }

    return (
        <Row>
            <Col className={s.addTodoForm}>
                <FormControl placeholder="Enter task" value={value} onChange={(e) => setValue(e.target.value)} className={s.addTodoForm}/>
                <Button onClick={saveTodo} className={s.btn}>Save</Button>
            </Col>
        </Row>
    )
}

export default AddTodo;