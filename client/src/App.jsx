import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import CreateAddress from './pages/CreateAdress';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageCapture from './pages/ImageCapture';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreateEmployee from './pages/CreateEmployee';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import EditEmployee from './pages/EditEmployee';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/' element={<Home />} />
          <Route path='/address' element={<CreateAddress />} />
          <Route path='/image' element={<ImageCapture />} />


        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-employee' element={<CreateEmployee />} />
          <Route path='/edit-employee/:id' element={<EditEmployee />} />
         
        </Route>

      </Routes>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
}
