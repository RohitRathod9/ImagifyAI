/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Create the context
export const AppContext = createContext();

const AppContextProvider = (props) => {
  // State variables
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [credit, setCredit] = useState(false);

  // Backend URL from environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  // Load credits data from the backend
  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { token },
      });

      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Generate an image by sending a prompt to the backend
  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        { headers: { token } }
      );

      if (data.success) {
        loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditsData();

        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout functionality
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  // Load credits data whenever the token changes
  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  // Context value
  const value = {
    token,
    setToken,
    user,
    setUser,
    showLogin,
    setShowLogin,
    credit,
    setCredit,
    loadCreditsData,
    backendUrl,
    generateImage,
    logout,
  };

  // Provide context to children components
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
