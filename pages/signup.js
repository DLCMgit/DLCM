import { supabase } from '@/utils/supabase'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Signup = () => {
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    passwordCheck: ''
  })
  const [userCreated, setUserCreated] = useState(false)

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let { data, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password
    })

    if (error) {
      return <p>Something went wrong, try again later</p>
    } else {
      setUserCreated(true)
    }
  }
  return (
    <div className="signup form-container">
      {userCreated ? (
        <div className="user-created">
          <h1>New User Created</h1>
          <p>
            Thank you for signing up! Please sign in to continue creating your
            profile.
          </p>
          <Link href="/">Sign In</Link>
        </div>
      ) : (
        <div className="create-user">
          <h1>Create User</h1>
          <form className="create-user-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="email">Email</label>
              <input
                onChange={handleChange}
                id="email"
                type="email"
                value={newUser.email}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input
                onChange={handleChange}
                id="password"
                type="password"
                value={newUser.password}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="passwordCheck">Re-enter password</label>
              <input
                onChange={handleChange}
                id="passwordCheck"
                type="password"
                value={newUser.passwordCheck}
                required
              />
            </div>
            <button
              type="submit"
              className="btn primary"
              disabled={
                !newUser.email ||
                !newUser.password ||
                newUser.password != newUser.passwordCheck
              }
            >
              Sign Up
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Signup
