import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import boardApi from '../api/boardApi'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Kanban from '../components/common/Kanban'
import { setBoards } from '../redux/features/boardSlice'

let timer
const timeout = 500

const Board = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { boardId } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sections, setSections] = useState([])

  const boards = useSelector((state) => state.board.value)

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId)
        setTitle(res.title)
        setDescription(res.description)
        setSections(res.sections)
      } catch (err) {
        console.log(err)
      }
    }
    getBoard()
  }, [boardId])

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    setTitle(newTitle)

    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], title: newTitle }

    dispatch(setBoards(temp))

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle })
      } catch (err) {
        console.log(err)
      }
    }, timeout);
  }

  const updateDescription = async (e) => {
    clearTimeout(timer)
    const newDescription = e.target.value
    setDescription(newDescription)
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription })
      } catch (err) {
        console.log(err)
      }
    }, timeout);
  }

  const deleteBoard = async () => {
    try {
      await boardApi.delete(boardId)

      const newList = boards.filter(e => e.id !== boardId)
      if (newList.length === 0) {
        navigate('/boards')
      } else {
        navigate(`/boards/${newList[0].id}`)
      }
      dispatch(setBoards(newList))
    } catch (err) {
      console.log(err)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className='boradcontainer' style={{padding:'7px'}}>
      <Button onClick={logout}>
        <span>Logout</span>
      </Button>
      <button onClick={deleteBoard} style={{
        backgroundColor: 'red', 
        borderRadius: '5px',
        border: 'none',
        color: '#fff',
        padding: '4px 12px',
        }}>
        <span>Delete All</span>
      </button>
      <div style={{width: '100%',height:'15px'}}></div>
      <div style={{display: 'block'}}>
          <label>Name: </label>
          <Input
            type="text"
            value={title}
            onChange={updateTitle}
            placeholder='Untitled'
          />
          <label>  Description: </label>
          <Input
            type="text"
            value={description}
            onChange={updateDescription}
            placeholder='Add a description'
          />
        </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        
        <div className='topBar' style={{ padding: '10px 10px' }}>
            <Kanban data={sections} boardId={boardId}/>
        </div>
      </div>
    </div>
  )
}

export default Board