import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/userContext"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import Spinner from "../components/Spinner"

const DeletePost = ({postId: id}) => {

  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()
  const location = useLocation()

  const apiUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [])

  const removePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${apiUrl}/posts/${id}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});

      if (response.status == 200) {
        if (location.pathname == `/myposts/${currentUser.id}`) {
          navigate(0)
        } else {
          navigate('/')
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <Link className="btn sm danger" onClick={() => removePost(id)}>Delete</Link>
  )
}

export default DeletePost
