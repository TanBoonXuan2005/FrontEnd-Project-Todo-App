import { AuthContext } from './contexts/AuthContext';
import { RouterProvider } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import router from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import { TodoContext } from "./contexts/TodoContext";

function TodoProvider({ username, children }) {
  const [todos, setTodos] = useLocalStorage(`todos_${username}`, []);
  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodoContext.Provider>
  );
} 

export default function App() {
  const [token, setToken] = useLocalStorage("token", null);

  const login = (username) => {
    setToken({username})
  }

  const logout = () => {
    setToken(null)
    window.location.href = "/login";
  }

  const value = {
    user: token,
    token,
    login, 
    logout
  }

  const currentUsername = token ? token.username : "guest";

  return (
    <AuthContext.Provider value={value}>
      <TodoProvider username={currentUsername} key={currentUsername}> 
        <RouterProvider router={router} />
      </TodoProvider>
    </AuthContext.Provider>
  );
}