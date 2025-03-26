import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "../src/pages/Login/Login";
import { Signup } from "../src/pages/Signup/Signup";
import Home from "./pages/Home/Home";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import PrivateRoute from "./components/Layouts/PrivateRoute"; 
import { AuthProvider } from "./components/Context/AuthContext"; 



const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "Home",
        element: <PrivateRoute element={<Home />} />, 
      },
    ],
  },
]);

export const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
