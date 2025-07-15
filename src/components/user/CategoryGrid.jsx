const categories = [
  { name: 'Electronics', icon: '📱', bg: 'bg-blue-100 dark:bg-blue-900' },
  { name: 'Fashion', icon: '👕', bg: 'bg-pink-100 dark:bg-pink-900' },
  { name: 'Home & Garden', icon: '🏠', bg: 'bg-green-100 dark:bg-green-900' },
  { name: 'Beauty', icon: '💄', bg: 'bg-purple-100 dark:bg-purple-900' },
  { name: 'Sports', icon: '⚽', bg: 'bg-yellow-100 dark:bg-yellow-900' },
  { name: 'Books', icon: '📚', bg: 'bg-red-100 dark:bg-red-900' },
];

const CategoryGrid = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${category.bg} p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer text-center`}
            >
              <span className="text-4xl mb-3 block">{category.icon}</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;