import { Link, useParams } from "react-router-dom";
import PostAuthor from "../components/PostAuthor";
import { useContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import DeletePost from './DeletePost';
import { UserContext } from "../context/userContext";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const PostDetails = () => {
    const { id } = useParams();
    const { currentUser } = useContext(UserContext);
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");

    const apiUrl = process.env.REACT_APP_BASE_URL;
    const assetsUrl = process.env.REACT_APP_ASSETS_URL;

    useEffect(() => {
        const getPost = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/posts/${id}`);
                const postData = response.data;
                setPost(postData);
                setLikes(postData.likes || []);
                setIsLiked(postData.likes.includes(currentUser?.id));
                setComments(Array.isArray(postData.comments) ? postData.comments : []);
            } catch (error) {
                setError(error.message);
            }
            setIsLoading(false);
        };

        getPost();
    }, []);

    const handleLike = async () => {
        try {
            const token = currentUser?.token;
            const response = await axios.post(`${apiUrl}/posts/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                const updatedLikes = response.data.likes;
                setIsLiked(response.data.isLiked);
                setLikes(updatedLikes);
            }
        } catch (error) {
            console.log("Failed to like the post:", error);
        }
    };

    const handleCommentSubmit = async (e) => {
      e.preventDefault();

      if (commentText.trim() === "") return;

        try {
            const token = currentUser?.token;
            const response = await axios.post(`${apiUrl}/posts/${id}/comment`, { text: commentText }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && Array.isArray(response.data.comments)) {
                setComments(response.data.comments);
                setCommentText("");
            } else {
              console.error("Unexpected response format:", response.data);
            }
        } catch (error) {
            console.log("Failed to add comment:", error);
        }
    };

    const handleCommentEdit = async (commentId) => {
      try {
        const token = currentUser?.token;

        const response = await axios.patch(`${apiUrl}/posts/${id}/comments/${commentId}`, { text: editText }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && Array.isArray(response.data.comments)) {
          setComments(response.data.comments);
          setEditingCommentId(null);
          setEditText("");
        } else {
          console.error("Unexpected response format:", response.data);
        }

      } catch (error) {
        console.log('Failed to edit a comment:', error);
        
      }
    }

    const handleCommentDelete = async (commentId) => {
      try {
        const token = currentUser?.token;

        const response = await axios.delete(`${apiUrl}/posts/${id}/comments/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    
        if (response.data && Array.isArray(response.data.comments)) {
          setComments(response.data.comments);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error('Failed to delete a comment:', error.response ? error.response.data : error.message);
      }
    };
    

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <section className="post-details">
            {error && <p className="error">{error}</p>}
            {post && <div className="container post-details__container">

                <div className="post-details__header">
                    <PostAuthor authorID={post.creator} createdAt={post.createdAt} />

                    {currentUser?.id === post.creator && <div className="post-details__buttons">
                        <Link to={`/posts/${post?._id}/edit`} className="btn sm primary">Edit</Link>
                        <DeletePost postId={id} />
                    </div>}
                </div>
                
                <h1>{post.title}!</h1>
                <div className="post-details__thumbnail">
                    <img src={`${assetsUrl}/uploads/${post.thumbnail}`} alt="" />
                </div>
                <p dangerouslySetInnerHTML={{ __html: post.description }}></p>

                {currentUser && <div className="like-container">
                    <div className="post-details__like">
                        <button onClick={handleLike} className="like-button">
                            {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
                        </button>
                    </div>
                    <span className="post-count__like">{likes.length} likes</span>
                </div>}

                {currentUser && <div className="comments-section">
                    <h2>Comments</h2>
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>
                    <div className="comments-wrapper">
                    <ul>
                        {comments.map(comment => (
                            <li key={comment._id}>
                                <p>{editingCommentId === comment._id ? (
                                  <input 
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)} />
                                ) : (
                                  comment.text
                                )}</p>
                                <small className="comment-styles">By: {comment.postedBy?.name}</small>
                                {currentUser?.id === comment.postedBy?._id && (
                                  <div>
                                    {editingCommentId === comment._id ? (
                                      <div>
                                        <button onClick={ () => handleCommentEdit(comment._id)} className="save-btn">Save</button>
                                        <button onClick={() => { setEditingCommentId(null); setEditText('');}} className="cancel-btn">Cancel</button>
                                      </div>
                                    ) : (
                                      <div>
                                       <button onClick={() => { setEditingCommentId(comment._id); setEditText(comment.text);}} className="edit-btn">Edit</button>
                                       <button onClick={() => handleCommentDelete(comment._id)} className="delete-btn">Delete</button>
                                      </div>
                                    )}
                                  </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    </div>
                </div>}

            </div>}
        </section>
    );
};

export default PostDetails;

