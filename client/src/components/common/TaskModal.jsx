import { Backdrop, Modal } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
// import { Backdrop, Modal } from 'react-modal'
import taskApi from '../../api/taskApi';

const modalStyle = {
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  backgroundColor: '#fff',
  border: '0px solid #000',
  boxShadow: 24,
  p: 1,
  height: '50%',
  padding: '10px'
}

let timer
const timeout = 500
let isModalClosed = false

const TaskModal = props => {
  const boardId = props.boardId
  const [task, setTask] = useState(props.task)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const editorWrapperRef = useRef()

  useEffect(() => {
    setTask(props.task)
    setTitle(props.task !== undefined ? props.task.title : '')
    setContent(props.task !== undefined ? props.task.content : '')
    if (props.task !== undefined) {
      isModalClosed = false
    }
  }, [props.task])

  const onClose = () => {
    isModalClosed = true
    props.onUpdate(task)
    props.onClose()
  }

  const deleteTask = async () => {
    try {
      await taskApi.delete(boardId, task.id)
      props.onDelete(task)
      setTask(undefined)
    } catch (err) {
      console.log(err)
    }
  }

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle })
      } catch (err) {
        console.log(err)
      }
    }, timeout)

    task.title = newTitle
    setTitle(newTitle)
    props.onUpdate(task)
  }

  const updateContent = async (event, editor) => {
    clearTimeout(timer)
    const data = editor.getData()

    console.log({ isModalClosed })

    if (!isModalClosed) {
      timer = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content: data })
        } catch (err) {
          console.log(err)
        }
      }, timeout);

      task.content = data
      setContent(data)
      props.onUpdate(task)
    }
  }

  return (
    <Modal
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <div style={modalStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '100%'
        }}>
          <button variant='outlined' color='error' onClick={deleteTask}>
            <FaRegTrashAlt />
          </button>
        </div>
        <div style={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          padding: '2rem 5rem 5rem'
        }}>
          <input
            type='text'
            value={title}
            onChange={updateTitle}
            placeholder='Untitled'
          />
          <div
            ref={editorWrapperRef}
            style={{
              position: 'relative',
              height: '80%',
              overflowX: 'hidden',
              overflowY: 'auto'
            }}
          >
            <div style={{ widht: '100%', height: '10px' }} />
            <textarea
              data={content}
              onChange={updateContent}
              rows={4}
              cols={50}
              placeholder="Enter your text here"
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TaskModal