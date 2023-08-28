import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const Signup = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')
    setConfirmPasswordErrText('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()
    const confirmPassword = data.get('confirmPassword').trim()

    let err = false

    if (username === '') {
      err = true
      setUsernameErrText('Please fill this field')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Please fill this field')
    }
    if (confirmPassword === '') {
      err = true
      setConfirmPasswordErrText('Please fill this field')
    }
    if (password !== confirmPassword) {
      err = true
      setConfirmPasswordErrText('Confirm password not match')
    }

    if (err) return

    setLoading(true)

    try {
      const res = await authApi.signup({
        username, password, confirmPassword
      })
      setLoading(false)
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {
      const errors = err.data.errors
      errors.forEach(e => {
        if (e.param === 'username') {
          setUsernameErrText(e.msg)
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg)
        }
        if (e.param === 'confirmPassword') {
          setConfirmPasswordErrText(e.msg)
        }
      })
      setLoading(false)
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