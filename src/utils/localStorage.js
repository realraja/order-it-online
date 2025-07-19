export const SaveLocalStorage = ({ key, value }) => {
    if (typeof window === 'undefined') return null; // Avoid server-side crash
    localStorage.setItem(key, JSON.stringify(value));
  };

export const GetLocalStorage = ({ key}) => {
    if (typeof window === 'undefined') return null; // Avoid server-side crash
  
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };
  

  export const CartStorageKey = 'CART'
  export const WishlistStorageKey = 'WISHLIST'