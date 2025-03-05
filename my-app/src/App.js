import { Routes, Route, Link } from 'react-router-dom'; 

import logo from './logo.svg';
import './App.css';

import Home from "./pages/Home";
import Memo from "./pages/Memo";
import Video from "./pages/Video";
import Video2 from "./pages/Video2";
import Video3 from "./pages/Video3";

function App() {
  return (
    <div>
      <nav className="navbar">

        <Link class="navbar__logo" to="/">Home</Link>
        <ul className="navbar__menu">
          <li><Link className="nav__li" to="/"><a>Home</a></Link></li>
          <li><Link className="nav__li" to="/memo"><a>Memo</a></Link></li>
          <li><Link className="nav__li" to="/video"><a>Video</a></Link></li>
          <li><Link className="nav__li" to="/video2"><a>Video2</a></Link></li>
          <li><Link className="nav__li" to="/video3"><a>Video3</a></Link></li>          
        </ul>
        <a>menu</a>
      </nav>
      <div>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/memo" element={<Memo />} />
          <Route path="/video" element={<Video />} />
          <Route path="/video2" element={<Video2 />} />
          <Route path="/video3" element={<Video3 />} />
        </Routes>
        </div>
    </div>
  );
}

export default App;
