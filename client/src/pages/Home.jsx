import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import boardApi from "../api/boardApi"
import { setBoards } from "../redux/features/boardSlice"

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const createBoard = async () => {
    setLoading(true)
    try {
      const res = await boardApi.create()
      dispatch(setBoards([res]))
      navigate(`/boards/${res.id}`)
    } catch (err) {
      alert(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <button
        variant='outlined'
        color='success'
        onClick={createBoard}
        loading={loading}
      >
        Click here to create your first board
      </button>
    </div>
  )
}

export default Home