import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from "../pages/Home/HomePage.tsx";
import Toolbar from "../components/Toolbar/Toolbar.component.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>,
  },
]);

export default () => <RouterProvider router={router} />;