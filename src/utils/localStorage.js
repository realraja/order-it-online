export const SaveLocalStorage = ({ key, value }) => {
  localStorage.setItem(key, JSON.stringify(value));
}; 

export const GetLocalStorage = ({ key }) => {

  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

export const CartStorageKey = "CART";
export const WishlistStorageKey = "WISHLIST";
export const AdminSidebar = "ADMINSIDEBAR";
