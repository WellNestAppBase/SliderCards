import { useEffect } from "react";

function Home() {
  useEffect(() => {
    console.log("Home component mounted");
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to the App</h1>
        <p className="mb-6">
          Check out our sliding pages storyboard with dark to light blue
          transitions
        </p>
        <a
          href="/tempobook/storyboards/307ad086-4ceb-4427-870f-14652ead9d34"
          className="px-6 py-3 rounded-lg font-semibold text-lg duration-150 text-white bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700"
        >
          View Storyboard
        </a>
      </div>
    </div>
  );
}

export default Home;
