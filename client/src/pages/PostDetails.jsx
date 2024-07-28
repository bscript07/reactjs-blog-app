import { Link, useParams } from "react-router-dom"
import PostAuthor from "../components/PostAuthor"
import { useContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import DeletePost from './DeletePost';
import { UserContext } from "../context/userContext";
import axios from "axios";

const PostDetails = () => {
  const {id} = useParams()
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {currentUser} = useContext(UserContext)

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)

        setPost(response.data)
      } catch (error) {
        setError(error);
      }

      setIsLoading(false)
    }

    getPost()
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <section className="post-details">
      {error && <p className="error">{error}</p>}
      {post && <div className="container post-details__container">
        <div className="post-details__header">
          <PostAuthor authorID={post.creator} createdAt={post.createdAt}/>
          {currentUser?.id == post?.creator && <div className="post-details__buttons">
            <Link to={`/posts/${post?._id}/edit`} className="btn sm primary">Edit</Link>
            <DeletePost postId={id} />
          </div>}
        </div>
        <h1>{post.title}!</h1>
        <div className="post-details__thumbnail">
          <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
        </div>
        <p dangerouslySetInnerHTML={{__html: post.description}}></p>
      </div>}
    </section>
  )
}

export default PostDetails
