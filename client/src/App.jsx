// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Activities from "./pages/Activities";
import Goals from "./pages/Goals";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-blue-600 text-white py-4">
          <div className="container mx-auto flex justify-between items-center px-4">
            <h1 className="text-2xl font-bold">
              <Link to="/">Fitness Tracker</Link>
            </h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="hover:underline">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/activities" className="hover:underline">
                    Activities
                  </Link>
                </li>
                <li>
                  <Link to="/goals" className="hover:underline">
                    Goals
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/goals" element={<Goals />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto text-center">
            &copy; {new Date().getFullYear()} Fitness Tracker
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
