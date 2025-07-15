const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Everything You Need
            </h1>
            <p className="text-xl mb-8">
              The one-stop shop for all your needs. From electronics to fashion,
              home goods and more.
            </p>
            <button className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300">
              Shop Now
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/static/logo.png"
              alt="Hero"
              className="rounded-lg "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;