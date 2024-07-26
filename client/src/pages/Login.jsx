import { useState } from "react"
import { Link } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return {...prevState, [e.target.name]: e.target.value}
    });
  }

  return (
    <section className="login">
      <div className="container">
        <h2 className="sign-in">Sign In</h2>
        <form className="form login__form">
          <p className="form__error-message">This is an error message</p>
          <input type="text" placeholder="Email" name="email" value={userData.email} onChange={changeInputHandler} autoFocus />
          <input type="password" placeholder="Password" name="password" value={userData.password} onChange={changeInputHandler} />

          <div className="login-btn">
          <button type="submit" className="btn primary">Login</button>
          </div>
        </form>
        <small className="sign-up-content">Don't have an account? <Link to='/register'>Sign Up</Link></small>
      </div>
    </section>
  )
}

export default Register
