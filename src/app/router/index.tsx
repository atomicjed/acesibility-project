import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from "../pages/Home/HomePage.tsx";
import FormPage from "../pages/FormPage/FormPage.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>,
  },
  {
    path: '/form-page',
    element: <FormPage />,
  },
]);

export default () => <RouterProvider router={router} />;