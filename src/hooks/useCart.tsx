import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
     const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const indexProduct = cart.findIndex(element => element.id == productId)
      const responseProdutc = await api.get(`products/${productId}`) 
 
      if( indexProduct === -1){   
          console.log(indexProduct)
           
        const newProduct = {
         id: responseProdutc.data?.id,
         title: responseProdutc.data?.title,
         price: responseProdutc.data?.price,
         image: responseProdutc.data?.image,
         amount: 1
       }
        setCart([...cart , newProduct])
       }else{
        //update the amount value

        const responseStock = await api.get(`stock/${productId}`) 
        if(cart[indexProduct].amount < responseStock.data.amount ) {
          const listCart = [...cart]
          listCart[indexProduct].amount += 1
          setCart(listCart)

        }else {
          toast.error('Quantidade solicitada fora de estoque');
        }  
      } 
     
    } catch(error) {
      // TODO
      toast.error(`Erro:${error}`);
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
     
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
