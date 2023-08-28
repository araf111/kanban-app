import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const Login = () => {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()

    try {
      const res = await authApi.login({ username, password })
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {

    }
  }

  return (
    <>
      <form
        style={{ marginTop: 1, display: 'block' }}
        onSubmit={handleSubmit}
        noValidate
      >
        <Input
          type='text'
          required
          id='username'
          name='username'
          className='username'
          placeholder='email'
        />
        <Input
          required
          id='password'
          name='password'
          type='password'
          placeholder='password'
        />
        <Button type='submit'>
          Login
        </Button>
      </form>
      <p>Don't have an account? <Link to="/signup">Signup</Link></p>
    </>
  )
}

export default Login