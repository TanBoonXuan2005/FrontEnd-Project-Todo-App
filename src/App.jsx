import { AuthContext } from './contexts/AuthContext';
import { RouterProvider } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import router from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import { TodoContext } from "./contexts/TodoContext";

export default function App() {
  const [token, setToken] = useLocalStorage("token", null);
  const [todos, setTodos] = useLocalStorage('todos', []);

  const login = (username) => {
    setToken({username})
  }

  const logout = () => {
    setToken(null)
  }

  const value = {
    user: token,
    token,
    login, 
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      <TodoContext.Provider value={{todos, setTodos}}>
        <RouterProvider router={router} />
      </TodoContext.Provider>
    </AuthContext.Provider>
  );
}