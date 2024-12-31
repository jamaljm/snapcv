// Loader.tsx
const Loader = () => {
  return (
    <div className="flex items-center w-full h-screen justify-center ">
      <div className="inline-block rounded-2xl w-1 h-5 bg-black bg-opacity-50 animate-scale-up4"></div>
      <div className="inline-block w-1 h-8 bg-black bg-opacity-50 rounded-2xl mx-1 animate-scale-up4 delay-75"></div>
      <div className="inline-block w-1 h-5 bg-black bg-opacity-50 rounded-2xl animate-scale-up4 delay-150"></div>
    </div>
  );
};

export default Loader;
