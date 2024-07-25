import { useState } from "react"
import { Link } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return {...prevState, [e.target.name]: e.target.value}
    });
  }

  return (
    <section className="register">
      <div className="container">
        <h2>Sign up</h2>
        <form className="form register__form">
          <p className="form__error-message">This is an error message</p>
          <input type="text" placeholder="Full name" name="name" value={userData.name} onChange={changeInputHandler} />
          <input type="text" placeholder="Email" name="email" value={userData.email} onChange={changeInputHandler} />
          <input type="password" placeholder="Password" name="password" value={userData.password} onChange={changeInputHandler} />
          <input type="password" placeholder="Confirm password" name="confirmPassword" value={userData.confirmPassword} onChange={changeInputHandler} />

          <div className="register-btn">
          <button type="submit" className="btn primary">Register</button>
          </div>
        </form>
        <small className="sign-in-content">Already have an account? <Link to='/login'>Sign In</Link></small>
      </div>
    </section>
  )
}

export default Register
