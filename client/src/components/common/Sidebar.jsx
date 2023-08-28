import { ListItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FaRegPlusSquare, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import boardApi from '../../api/boardApi';
import assets from '../../assets/index';
import { setBoards } from '../../redux/features/boardSlice';

const Sidebar = () => {
  const user = useSelector((state) => state.user.value)
  const boards = useSelector((state) => state.board.value)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { boardId } = useParams()
  const [activeIndex, setActiveIndex] = useState(0)

  const sidebarWidth = 250
  // console.log(boardId);
  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll()
        dispatch(setBoards(res))
      } catch (err) {
        alert(err)
      }
    }
    getBoards()
  }, [dispatch])

  useEffect(() => {
    const activeItem = boards.findIndex(e => e.id === boardId)
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0].id}`)
    }
    // console.log(boards[0]);
    setActiveIndex(activeItem)
  }, [boards, boardId, navigate])

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...boards]
    const [removed] = newList.splice(source.index, 1)
    newList.splice(destination.index, 0, removed)

    const activeItem = newList.findIndex(e => e.id === boardId)
    setActiveIndex(activeItem)
    dispatch(setBoards(newList))

    try {
      await boardApi.updatePositoin({ boards: newList })
    } catch (err) {
      alert(err)
    }
  }

  const addBoard = async () => {
    try {
      const res = await boardApi.create()
      const newList = [res, ...boards]
      dispatch(setBoards(newList))
      navigate(`/boards/${res.id}`)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <div
      container={window.document.body}
      open={true}
      style={{
        height: '100vh',
        width: sidebarWidth,
        '& > div': { borderRight: 'none' }
      }}
    >
      <ul
        style={{
          height: '100vh',
          backgroundColor: assets.colors.secondary,
          marginTop: '0px',
          padding: '7px'
        }}
      >
        <li>
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{fontWeight: '700',color: '#fff'}}>
              {user.username}
            </span>
            <button onClick={logout}>
              <FaSignOutAlt />
            </button>
          </div>
        </li>
        <div style={{ paddingTop: '10px' }} />
        <div style={{ paddingTop: '10px' }} />
        <li>
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{fontWeight: '700',color: '#fff'}}>
              Board List
            </span>
            <button onClick={addBoard}>
              <FaRegPlusSquare />
            </button>
          </div>
        </li>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable key={'list-board-droppable-key'} droppableId={'list-board-droppable'}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {
                  boards.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          selected={index === activeIndex}
                          component={Link}
                          to={`/boards/${item.id}`}
                          style={{
                            pl: '20px',
                            cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                          }}
                        >
                          <p
                            style={{ 
                              color:'#fff',
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis' 
                            }}
                          >
                            {item.icon} {item.title}
                          </p>
                        </ListItem>
                      )}
                    </Draggable>
                  ))
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ul>
    </div>
  )
}

export default Sidebar