import { useState, useEffect } from 'react'; // 1. Import useState
import authService from '../features/auth/authService'; // Import the service
import { useNavigate } from 'react-router-dom'; // For redirecting
import { useAuthStore } from '../features/auth/authStore'; // Import our new store


function Register() {
  const navigate = useNavigate();

  // Get user state from our global store
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const { name, email, password, password2 } = formData;

  // This hook runs when the component loads or when state values change
  useEffect(() => {
    // If the user is logged in (i.e., registration was successful), redirect
    if (user) {
      navigate('/'); // Redirect to the main dashboard page
    }
  }, [user, navigate]); // Dependencies: the effect runs when user or navigate changes

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      console.log('Passwords do not match');
    } else {
      const userData = { name, email, password };
      try {
        const registeredUser = await authService.register(userData);
        // Manually update the state in our store
        useAuthStore.setState({ user: registeredUser });
      } catch (error) {
        console.error(error);
      }
    }
  };


return (
    <>
      <section className="text-center">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="text-gray-500 mt-2">Please create an account</p>
      </section>

      <div className="flex justify-center mt-8">
        <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={onChange}
            />
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-200">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );

}
export default Register;