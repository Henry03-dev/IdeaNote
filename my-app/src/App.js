import { Routes, Route, Link } from 'react-router-dom'; 

import logo from './logo.svg';
import './App.css';

import Home from "./pages/Home";
import Video from "./pages/Video";
import Video2 from "./pages/Video2";

function App() {
  return (
    <div>
      <nav className="navbar">

        <Link class="navbar__logo" to="/">Home</Link>
        <ul className="navbar__menu">
          <li><Link className="nav__li" to="/"><a>Home</a></Link></li>
          <li><Link className="nav__li" to="/video"><a>Video</a></Link></li>
          <li><Link className="nav__li" to="/video2"><a>Video2</a></Link></li>
        </ul>
        <a>menu</a>
      </nav>
      <div>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/video" element={<Video />} />
          <Route path="/video2" element={<Video2 />} />
        </Routes>
        </div>
    </div>
  );
}

export default App;
