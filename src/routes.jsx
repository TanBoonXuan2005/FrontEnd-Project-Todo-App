import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TodoPage from "./pages/TodoPage";
import RequireAuth from "./components/RequireAuth";
import Header from "./components/Header";
import Home from "./pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Header />,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register/>
            },
            {
                path: "todos",
                element: (
                    <RequireAuth>
                        <TodoPage />
                    </RequireAuth>
                )
            }
        ],
    },
]);

export default router;