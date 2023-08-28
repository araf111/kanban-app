import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import boardApi from "../api/boardApi"
import Button from '../components/common/Button'
import { setBoards } from "../redux/features/boardSlice"
const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const createBoard = async () => {
    try {
      const res = await boardApi.create()
      dispatch(setBoards([res]))
      navigate(`/boards/${res.id}`)
    } catch (err) {
      console.log(err)
    } finally {
    }
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Button onClick={createBoard} >
        Click here to create your first board
      </Button>
    </div>
  )
}

export default Home