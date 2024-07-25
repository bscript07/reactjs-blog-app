import { Link } from "react-router-dom"
import Avatar from '../images/avatar1.jpg';

const PostAuthor = () => {
  return (
    <Link to={`/posts/users/askjdkasjdk`} className='post__author'>
      <div className="post__author-avatar">
        <img src={Avatar} alt="" />
      </div>
      <div className="post__author-details">
        <h5>By: Brayan Markov</h5>
        <small>Just Now</small>
      </div>
    </Link>
  )
}

export default PostAuthor
