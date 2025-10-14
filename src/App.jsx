import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute'; // Import the new component
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupPage from './pages/GroupPage'; // Import the new page
import { Toaster } from 'react-hot-toast';



function App() {
  return (
    <>
      <Router>
        <Toaster />
        <div className="max-w-7xl mx-auto px-4">
          <Header />
          <Routes>
            {/* These routes are public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* This is the protected route */}
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
                <Route path="/group/:groupId" element={<GroupPage />} /> {/* Add this route */}
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;