import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from "../context/userContext";

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData);
      const newUser = await response.data;

      if (!newUser) {
        setError('Failed to register user. Please try again.');
      } else {
        setCurrentUser(newUser);
        navigate('/');
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2 className="sign-up">Sign Up</h2>
        <form className="form register__form" onSubmit={registerUser}>
          {error && <p className="form__error-message">{error}</p>}
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
  );
};

export default Register;

