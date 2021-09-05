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
      const listCart = [...cart]
 
      if( indexProduct === -1){   
          console.log(indexProduct)
           
        const newProduct = {
         id: responseProdutc.data?.id,
         title: responseProdutc.data?.title,
         price: responseProdutc.data?.price,
         image: responseProdutc.data?.image,
         amount: 1
       }
        listCart.push(newProduct)
        setCart( listCart)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(listCart))

       }else{
        //update the amount value

        const responseStock = await api.get(`stock/${productId}`) 
        if(cart[indexProduct].amount < responseStock.data.amount ) {
          listCart[indexProduct].amount += 1
          
          setCart(listCart)
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(listCart))


        }else {
          toast.error('Quantidade solicitada fora de estoque');
        }  
      } 
     
    } catch(error) {
      // TODO
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
     
      const listCart = [...cart]
      const indexProductRemove = listCart.findIndex(product => product.id === productId)

      if(indexProductRemove >-1){
        listCart.splice(indexProductRemove,1)
      }
      
      setCart(listCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(listCart))

    } catch {
      // TODO
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({productId, amount,}: UpdateProductAmount) => {
    try {
      // TODO
        const listCart = [...cart]
        const indexProduct = listCart.findIndex(product => product.id === productId)
        const {data} = await api.get(`stock/${productId}`) 
        const productSctock = data as Product

        if(amount <= productSctock.amount ){
          listCart[indexProduct].amount =amount
          setCart(listCart)
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(listCart))
        }else{
          toast.error('Quantidade solicitada fora de estoque');
        }

    } catch {
      // TODO
      toast.error('Erro na alteração de quantidade do produto');
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
