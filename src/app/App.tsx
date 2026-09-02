import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AnimatedRoutes from './AnimatedRoutes';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </CartProvider>
  );
}
