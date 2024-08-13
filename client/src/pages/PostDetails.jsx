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
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);

    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        const getPost = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
                setPost(response.data);
                setLikes(response.data.likes || []);
                setIsLiked(response.data.likes.includes(currentUser?.id));
                setComments(response.data.comments || []);
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
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts/${id}/like`, {}, {
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

    const handleCommentSubmit = async () => {
        try {
            const token = currentUser?.token;
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts/${id}/comment`, { text: commentText }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setComments(response.data.comments);
                setCommentText("");
            }
        } catch (error) {
            console.log("Failed to add comment:", error);
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
                    <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
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
                    <ul>
                        {comments.map(comment => (
                            <li key={comment._id}>
                                <p>{comment.text}</p>
                                <small>By: {comment.postedBy?.name}</small>
                            </li>
                        ))}
                    </ul>
                </div>}
            </div>}
        </section>
    );
};

export default PostDetails;

