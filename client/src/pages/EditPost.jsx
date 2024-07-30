import { useContext, useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false]}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list':'ordered'}, {'list':'bullet'}, {'indent':'-1'}, {'indent':'+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const POST_CATEGORIES = ['Uncategorized', 'Art', 'Business', 'Cryptocurrency', 'Finance', 'Health & Wellness', 'Food & Cooking', 'Investment', 'Weather'];

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit post</h2>
        <p className="form__error-message">
          This is an error message!
        </p>
        <form className="form create-post__form">
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            {
              POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)
            }
          </select>
            <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
            <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept="png, jpg, jpeg" />
            <div className="create-btn">
            <button type="submit" className="btn primary">Update</button>
            </div>
        </form>
      </div>
    </section>
  )
}

export default EditPost
