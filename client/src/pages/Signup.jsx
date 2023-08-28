import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const Signup = () => {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()
    const confirmPassword = data.get('confirmPassword').trim()

    try {
      const res = await authApi.signup({
        username, password, confirmPassword
      })
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {
    }
  }

  return (
    <>
      <form
        style={{ marginTop: '1px' }}
        onSubmit={handleSubmit}
        noValidate
      >
        <Input
          type='text'
          required
          id='username'
          name='username'
          placeholder='email'
        />
        <Input
          required
          id='password'
          name='password'
          type='password'
          placeholder='password'
        />
        <Input
          required
          id='confirmPassword'
          label='Confirm Password'
          name='confirmPassword'
          type='password'
          placeholder='confirm password'
        />
        <Button type='submit'>
          Signup
        </Button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </>
  )
}

export default Signup