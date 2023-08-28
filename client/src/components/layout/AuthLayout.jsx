import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'

const AuthLayout = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setLoading(false)
      } else {
        navigate('/')
      }
    }
    checkAuth()
  }, [navigate])

  return (
    <div>
      <div style={{
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <h2>Kanban-Board</h2>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout