import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from "../pages/Home/HomePage.tsx";
import FormPage from "../pages/FormPage/FormPage.tsx";
import FatHippoScandal from "../pages/FatHippoScandal/FatHippoScandal.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <FatHippoScandal />,
  },
  {
    path: '/form-page',
    element: <FormPage />,
  },
]);

export default () => <RouterProvider router={router} />;