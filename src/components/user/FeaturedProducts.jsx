const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQXx9wB_SXpWpnd-fTENAih7FNzqBJoih0FZWXl5hFmhPFp8eWkra8k1rCiriuMChbKdI7DcZpnwHmekMQxiCiiYftm-stau6QTFOuVcBiH26HK9GSPCwxvLQ',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQXx9wB_SXpWpnd-fTENAih7FNzqBJoih0FZWXl5hFmhPFp8eWkra8k1rCiriuMChbKdI7DcZpnwHmekMQxiCiiYftm-stau6QTFOuVcBiH26HK9GSPCwxvLQ',
    rating: 4.2,
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 79.99,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQXx9wB_SXpWpnd-fTENAih7FNzqBJoih0FZWXl5hFmhPFp8eWkra8k1rCiriuMChbKdI7DcZpnwHmekMQxiCiiYftm-stau6QTFOuVcBiH26HK9GSPCwxvLQ',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Laptop Backpack',
    price: 49.99,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQXx9wB_SXpWpnd-fTENAih7FNzqBJoih0FZWXl5hFmhPFp8eWkra8k1rCiriuMChbKdI7DcZpnwHmekMQxiCiiYftm-stau6QTFOuVcBiH26HK9GSPCwxvLQ',
    rating: 4.3,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                    {product.rating}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;