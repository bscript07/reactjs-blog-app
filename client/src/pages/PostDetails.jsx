import { Link } from "react-router-dom"
import PostAuthor from "../components/PostAuthor"
import Thumbnail from '../images/blog22.jpg';

const PostDetails = () => {
  return (
    <section className="post-details">
      <div className="container post-details__container">
        <div className="post-details__header">
          <PostAuthor />
          <div className="post-details__buttons">
            <Link to={`/posts/werwer/edit`} className="btn sm primary">Edit</Link>
            <Link to={`/posts/werwer/delete`} className="btn sm danger">Delete</Link>
          </div>
        </div>
        <h1>This is the post title!</h1>
        <div className="post-details__thumbnail">
          <img src={Thumbnail} alt="" />
        </div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis optio illum modi nisi dignissimos excepturi commodi velit quis voluptatum placeat? Nostrum ipsa aliquid temporibus nesciunt dignissimos nobis maiores! Soluta, ullam inventore? Hic accusamus fuga fugiat ut possimus tenetur veniam animi.</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem porro hic, officiis minus debitis ad officia molestiae quia ipsam suscipit animi iusto repellat vitae dolorem neque laudantium? Cum laboriosam ipsam accusantium ab sed distinctio fuga voluptas sunt reprehenderit? Assumenda, iusto aliquam. Corrupti maiores quas numquam laudantium voluptatum autem ullam deleniti doloremque ducimus mollitia. Laborum, voluptatibus?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum ipsum quo ad harum facere mollitia earum similique dolorem quis deleniti est recusandae, id ab delectus labore! Aliquid ipsa perferendis cum inventore, natus aut saepe, omnis id iure enim optio voluptatum tempore aliquam doloribus. Ea reiciendis deleniti animi non earum commodi ab placeat consequatur quas! Fugit modi harum adipisci aut? Unde, libero veritatis. Expedita, inventore doloribus hic autem beatae eveniet aspernatur eligendi tempora culpa possimus harum odit. Minus blanditiis cupiditate minima distinctio asperiores nostrum? Natus, hic nobis eligendi magni explicabo accusamus at assumenda delectus nesciunt laudantium quos labore facere quod nisi vel reiciendis tenetur? Veritatis accusamus facilis nihil odio fuga culpa eaque?
        </p>
        <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim suscipit mollitia ratione?    
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi deserunt eum, quo sit corporis labore fuga molestiae veritatis, rerum neque recusandae? Autem illo nisi accusamus suscipit necessitatibus ex ea quos nemo omnis quidem illum voluptates recusandae soluta, eius dicta explicabo vel commodi? Dignissimos quia voluptatibus provident ipsam. Repellat vitae exercitationem architecto. Nihil fugit necessitatibus, tempora cum voluptate aspernatur provident illum odit fugiat enim ipsa sed sint consequatur laborum distinctio laudantium dolorem facere quia? Eligendi perspiciatis nemo voluptate hic mollitia maiores! Perspiciatis explicabo ipsum provident fugiat sunt quos quidem recusandae nam eos. Odit, placeat maxime esse nulla ipsum labore voluptate exercitationem autem dignissimos quis, excepturi earum. Eos, voluptatibus dolores ipsa explicabo officia nam accusamus ipsam quisquam deleniti, pariatur officiis, laudantium ullam. Alias distinctio amet quam quibusdam. Officiis minima neque quibusdam, suscipit non vitae velit quo. Repellat esse harum iste repellendus id quos atque velit dignissimos maiores suscipit voluptas quisquam amet veniam inventore rem assumenda, ut iusto dicta ratione nisi praesentium hic vero? At rem distinctio assumenda pariatur blanditiis illo nemo ex cum adipisci, rerum nesciunt vero dolor ut! Quibusdam assumenda cupiditate cum nihil doloremque quis hic perferendis nisi repellendus esse? Animi eum porro tempora delectus accusantium. Nulla deleniti adipisci consequatur quas.
      </p>
      </div>
    </section>
  )
}

export default PostDetails
