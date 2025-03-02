import { Routes, Route, Link } from 'react-router-dom'; 

import logo from './logo.svg';
import './App.css';

import Home from "./pages/Home";
import Memo from "./pages/Memo";
import Video from "./pages/Video";

function App() {
  return (
    <div>
      <nav className="navbar">

        <Link class="navbar__logo" to="/">Home</Link>
        <ul className="navbar__menu">
          <li><Link className="nav__li" to="/"><a>Home</a></Link></li>
          <li><Link className="nav__li" to="/memo"><a>Memo</a></Link></li>
          <li><Link className="nav__li" to="/video"><a>Video</a></Link></li>
        </ul>
        <a>menu</a>
      </nav>
      <div>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/memo" element={<Memo />} />
          <Route path="/video" element={<Video />} />
        </Routes>
        </div>
    </div>
  );
}

export default App;
