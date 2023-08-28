import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FaRegPlusSquare, FaRegTrashAlt } from 'react-icons/fa';
import sectionApi from '../../api/sectionApi';
import taskApi from '../../api/taskApi';
import Button from './Button';
import TaskModal from './TaskModal';

let timer
const timeout = 500

const Kanban = props => {
  const boardId = props.boardId
  const [data, setData] = useState([])
  const [selectedTask, setSelectedTask] = useState(undefined)

  useEffect(() => {
    setData(props.data)
  }, [props.data])

  // console.log(props.data);

  const onDragEnd = async ({ source, destination }) => {
    console.log(source);
    console.log(destination);
    console.log(data);
    if (!destination) return
    const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
    const destinationColIndex = data.findIndex(e => e.id === destination.droppableId)
    const sourceCol = data[sourceColIndex]
    const destinationCol = data[destinationColIndex]
    console.log(sourceColIndex);
    console.log(destinationColIndex);
    const sourceSectionId = sourceCol.id
    const destinationSectionId = destinationCol.id

    const sourceTasks = [...sourceCol.tasks]
    const destinationTasks = [...destinationCol.tasks]
    console.log(sourceTasks);
    console.log(destinationTasks);
    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, removed)
      data[sourceColIndex].tasks = sourceTasks
      data[destinationColIndex].tasks = destinationTasks
      console.log(data[sourceColIndex].tasks);
      console.log(data[destinationColIndex].tasks);
      console.log(sourceTasks);
      console.log(removed);
    } else {
      const [removed] = destinationTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, removed)
      data[destinationColIndex].tasks = destinationTasks
    }

    try {
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId
      })
      setData(data)
    } catch (err) {
      alert(err)
    }
  }

  const createSection = async () => {
    try {
      const section = await sectionApi.create(boardId)
      setData([...data, section])
    } catch (err) {
      alert(err)
    }
  }

  const deleteSection = async (sectionId) => {
    try {
      await sectionApi.delete(boardId, sectionId)
      const newData = [...data].filter(e => e.id !== sectionId)
      setData(newData)
    } catch (err) {
      alert(err)
    }
  }

  const updateSectionTitle = async (e, sectionId) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    const newData = [...data]
    console.log(newTitle);
    const index = newData.findIndex(e => e.id === sectionId)
    newData[index].title = newTitle
    setData(newData)
    timer = setTimeout(async () => {
      try {
        await sectionApi.update(boardId, sectionId, { title: newTitle })
      } catch (err) {
        alert(err)
      }
    }, timeout);
  }

  const createTask = async (sectionId) => {
    try {
      const task = await taskApi.create(boardId, { sectionId })
      const newData = [...data]
      const index = newData.findIndex(e => e.id === sectionId)
      newData[index].tasks.unshift(task)
      setData(newData)
    } catch (err) {
      alert(err)
    }
  }

  const onUpdateTask = (task) => {
    const newData = [...data]
    const sectionIndex = newData.findIndex(e => e.id === task.section.id)
    const taskIndex = newData[sectionIndex].tasks.findIndex(e => e.id === task.id)
    newData[sectionIndex].tasks[taskIndex] = task
    setData(newData)
  }

  const onDeleteTask = (task) => {
    const newData = [...data]
    const sectionIndex = newData.findIndex(e => e.id === task.section.id)
    const taskIndex = newData[sectionIndex].tasks.findIndex(e => e.id === task.id)
    newData[sectionIndex].tasks.splice(taskIndex, 1)
    setData(newData)
  }

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Button onClick={createSection}>
          Add section
        </Button>
      </div>
      <div style={{ width: '100%', height: '2px',backgroundColor:'#000',margin: '10px 0' }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          width: 'calc(100vw - 350px)',
          overflowX: 'auto'
        }}>
          {
            data.map(section => (
              <div key={section.id} style={{ width: '350px', backgroundColor: '#82E0AA', marginRight: '15px'}}>
                <Droppable key={section.id} droppableId={section.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ width: '300px', padding: '10px', marginRight: '10px' }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                      }}>
                        <input
                          type='text'
                          value={section.title}
                          onChange={(e) => updateSectionTitle(e, section.id)}
                          placeholder='Untitled'
                          style={{
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'rgb(130, 224, 170)',
                            fontWeight: '900',
                            width: '235px'
                          }}
                        />
                        <button onClick={() => createTask(section.id)} >
                          <FaRegPlusSquare style={{color: '#000',cursor: 'pointer'}}/>
                        </button>
                        <button onClick={() => deleteSection(section.id)} >
                          <FaRegTrashAlt style={{color: 'red',cursor: 'pointer'}}/>
                        </button>
                      </div>
                      {/* tasks */}
                      {
                        section.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div className="newcard"
                                style={{
                                  padding: '5px',
                                  marginBottom: '7px',
                                  cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                                }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedTask(task)}
                              >
                                <p style={{fontWeight: '700', fontSize: '15px'}}>
                                  {task.title === '' ? 'Untitled' : task.title}
                                </p>
                              </div>
                            )}
                          </Draggable>
                        ))
                      }
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))
          }
        </div>
      </DragDropContext>
      <TaskModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
      />
    </>
  )
}

export default Kanban