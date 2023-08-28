import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { setUser } from '../../redux/features/userSlice'
import authUtils from '../../utils/authUtils'
import Sidebar from '../common/Sidebar'

const AppLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated()
      if (!user) {
        navigate('/login')
      } else {
        // save user
        dispatch(setUser(user))
        setLoading(false)
      }
    }
    checkAuth()
  }, [navigate])

  return (
    <div style={{
      display: 'flex'
    }}>
      <Sidebar/>
      <div style={{
        flexGrow: 1,
        p: 1,
        width: 'max-content'
      }}>
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout