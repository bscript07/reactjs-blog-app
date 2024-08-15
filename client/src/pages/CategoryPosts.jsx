import { useEffect, useState } from "react";
import PostItem from "../components/PostItem";
import Spinner from '../components/Spinner';
import { useParams } from "react-router-dom";
import axios from "axios";

const CategoryPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {category} = useParams();

  const apiUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
      const fetchPosts = async () => {
          setIsLoading(true)
          try {
              const response = await axios.get(`${apiUrl}/posts/categories/${category}`)
              setPosts(response?.data)
          } catch (err) {
              console.log(err);
          }

          setIsLoading(false)
      }

      fetchPosts();
  }, [category])

  if (isLoading) {
      <Spinner />
  }

  return (
      <section className='posts'>
           {posts.length > 0 ? <div className='container posts__container'>
              {posts.map(({ _id: id, thumbnail, category, title, description, creator, createdAt }) =>
                  <PostItem key={id}
                      postID={id}
                      thumbnail={thumbnail}
                      category={category}
                      title={title}
                      description={description}
                      authorID={creator}
                      createdAt={createdAt}
                  />)}
          </div> : <h2 className='center'>No posts founds</h2>}
      </section>
  )
}

export default CategoryPosts
