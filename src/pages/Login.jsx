import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import authService from '../features/auth/authService';
import toast from 'react-hot-toast';


function Login() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to dashboard if already logged in
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    try {
      const loggedInUser = await authService.login(userData);
      // Update the global state
      useAuthStore.setState({ user: loggedInUser });
    } catch (error) {
      console.error(error); // We'll handle errors better later
      toast.error(error.message);

    }
  };


  const handleGuestLogin = async () => {
    const demoEmail = 'demo@gmail.com';
    const demoPassword = 'demouser';
    setFormData({email:demoEmail,password:demoPassword});

    const loginAsGuest = async () => {
      const userData = { email: demoEmail, password: demoPassword };
      try{
        const loggedInUser = await authService.login(userData);
        useAuthStore.setState({user: loggedInUser});

      }
      catch(error){
        console.error(error);
        toast.error(error.message);
      }
    };

    loginAsGuest();
  }

  return (
    <>
      <section className="text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 mt-2">Please log in to your account</p>
      </section>

      {/* Main container to center the form */}
      <div className="flex justify-center mt-8">
        <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          {/* Email Input */}
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
          {/* Password Input */}
          <div className="mb-6">
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
          {/* Submit Button */}
          <div>
            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-200">
              Submit
            </button>
          </div>
          <div className="mt-4">
    <button
      type="button"
      onClick={handleGuestLogin}
      className="w-full bg-gray-500 text-white font-bold py-2 rounded-lg hover:bg-gray-600 transition duration-200"
    >
      Guest Login (Demo)
    </button>
  </div>
        </form>
      </div>
    </>
  );
// ... the rest of the component
}
export default Login;