import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer>
      <ul className="footer__categories">
        <li><Link to="/posts/categories/Art">Art</Link></li>
        <li><Link to="/posts/categories/Business">Business</Link></li>
        <li><Link to="/posts/categories/Cryptocurrency">Cryptocurrency</Link></li>
        <li><Link to="/posts/categories/Finance">Finance</Link></li>
        <li><Link to="/posts/categories/Health">Health</Link></li>
        <li><Link to="/posts/categories/Food">Food</Link></li>
        <li><Link to="/posts/categories/Investment">Investment</Link></li>
        <li><Link to="/posts/categories/Weather">Weather</Link></li>
      </ul>
      <div className="footer__copyright">
        <p>
          © 2024, All Rights Reserved
        </p>
      </div>
    </footer>
  )
}

export default Footer
