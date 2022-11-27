import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Col, FormControl, Row} from 'react-bootstrap'
import s from './TodoList.module.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faLock, faLockOpen, faSave, faTrash} from '@fortawesome/free-solid-svg-icons'
import axios from "axios";


function TodoList({todo, setTodo, apiKey}) {

    const [edit, setEdit] = useState(null)
    const [title, setTitle] = useState(null)
    const [filtered, setFiltered] = useState(todo)

    useEffect(() => {
        setFiltered(todo)
    }, [todo])

    function todoFilter(status) {
        if (status === undefined) {
            setFiltered(todo)
        } else {
            let newTodo = [...todo].filter(item => item.status === status)
            setFiltered(newTodo)
        }
    }

    function deleteTodo(id) {
        let newTodo = [...todo].find(it => it.id === id)
        if (newTodo) {
            axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${newTodo.todoListId}/tasks/${newTodo.id}`, {
                withCredentials: true,
                headers: {
                    'API-KEY': apiKey
                }
            }).then(() => {
                newTodo = [...todo].filter(item => item.id !== id)
                setTodo(newTodo)
            })
        }

    }

    function setStatusTodo(item) {
        item.status = item.status ? 0 : 1;
        saveTodo(item)
    }

    function setNewTitle(item) {
        item.title = title || item.title
        saveTodo(item)
    }

    function editTodo(item) {
        setEdit(item.id);
        setTitle(item.title)
    }

    function saveTodo(item) {
        axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${item.todoListId}/tasks/${item.id}`, {
            title: item.title,
            completed: !!item.status,
            status: item.status,
            priority: 1,
            description: '',
            startDate: new Date(),
            deadline: new Date().toISOString()

        }, {
            withCredentials: true,
            headers: {
                'API-KEY': apiKey
            }
        }).then(() => {
            setEdit(null)
            setTitle(null)
            setTodo(todo.map(oldIdem => {
                if (item.id === oldIdem.id) {
                    console.log(item)
                    return item;
                }
                return oldIdem;
            }));
        }).catch((error) => {
            console.error(error);
        });
    }

    function doSearch(searchString) {
        if (searchString !== null && searchString !== '') {
            setFiltered([...todo].filter(item => item.title.includes(searchString)))
        } else {
            setFiltered(todo)
        }
    }

    return (
        <div>
            <Row>
                <Col className={s.addTodoForm}>
                    <FormControl placeholder="Search by title..." onChange={(e) => doSearch(e.target.value)}
                                 className={s.addTodoForm}/>
                </Col>
            </Row>
            <Row>
                <Col className={s.filter}>
                    <ButtonGroup aria-label="Basic example" className={s.btns}>
                        <Button variant="secondary" onClick={() => todoFilter()}>All</Button>
                        <Button variant="secondary" onClick={() => todoFilter(1)}>Open</Button>
                        <Button variant="secondary" onClick={() => todoFilter(0)}>Close</Button>
                    </ButtonGroup>
                </Col>
            </Row>

            {
                filtered.map(item => (
                    <div key={item.id} className={s.listItem}>
                        {
                            edit === item.id ?
                                <div>
                                    <input value={title} onChange={(e) => setTitle(e.target.value)}/>
                                </div> :
                                <div className={!item.status ? s.close : ''}>{item.title}</div>
                        }

                        {
                            edit === item.id ?
                                <div>
                                    <Button onClick={() => setNewTitle(item)} size="sm"><FontAwesomeIcon
                                        icon={faSave}/></Button>
                                </div> :
                                <div>
                                    <Button onClick={() => deleteTodo(item.id)} size="sm"><FontAwesomeIcon
                                        icon={faTrash}/></Button>
                                    <Button onClick={() => editTodo(item)} className={s.btn}
                                            size="sm"><FontAwesomeIcon icon={faEdit}/></Button>
                                    <Button onClick={() => setStatusTodo(item)} className={s.btn}
                                            size="sm">
                                        {
                                            item.status ? <FontAwesomeIcon icon={faLockOpen}/> :
                                                <FontAwesomeIcon icon={faLock}/>
                                        }
                                    </Button>
                                </div>
                        }


                    </div>
                ))
            }
        </div>
    )
}

export default TodoList;
