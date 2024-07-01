import { ToastContainer } from 'react-toastify'; // Correct import
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import { AuthProvider } from './AuthContext/AuthContext';
import { CartProvider } from './CartProvider/CartProvider';
import ItemListContainer from './components/ItemListContainer/ItemListContainer';
import Login from './components/Login/Login';
import { NavBar } from './components/NavBar/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ItemDetailContainer } from './components/ItemDetailContainer/ItemDetailContainer';

const App = () => {
  return (
    <>
        <AuthProvider>
      <CartProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path='/' element={<ItemListContainer />} />
              <Route path='/detail/:pid' element={<ItemDetailContainer />} />
              <Route path='/login' element={<Login />} />
            </Routes>
            <ToastContainer />
          </BrowserRouter>
      </CartProvider>
        </AuthProvider>
    </>
  );
};

export default App;
