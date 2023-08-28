import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()

    let err = false

    if (username === '') {
      err = true
      setUsernameErrText('Please fill this field')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Please fill this field')
    }

    if (err) return

    setLoading(true)

    try {
      const res = await authApi.login({ username, password })
      setLoading(false)
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {
      // const errors = err.data.errors
      // errors.forEach(e => {
      //   if (e.param === 'username') {
      //     setUsernameErrText(e.msg)
      //   }
      //   if (e.param === 'password') {
      //     setPasswordErrText(e.msg)
      //   }
      // })
      setLoading(false)
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