import { useState } from "react";

function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-full max-w-3xl h-96 cursor-pointer"
    >
      {!flipped ? (
        <div className="bg-white rounded-3xl shadow-xl h-full flex flex-col justify-center items-center p-10 hover:scale-105 transition duration-300">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">
            ❓ Question
          </h2>

          <p className="text-xl text-center text-gray-800">
            {question}
          </p>

          <p className="mt-8 text-purple-500 text-sm">
            Click to reveal answer 👆
          </p>
        </div>
      ) : (
        <div className="bg-purple-600 text-white rounded-3xl shadow-xl h-full flex flex-col justify-center items-center p-10 hover:scale-105 transition duration-300">
          <h2 className="text-3xl font-bold mb-6">
            ✅ Answer
          </h2>

          <p className="text-xl text-center">
            {answer}
          </p>

          <p className="mt-8 text-pink-200 text-sm">
            Click to see question again 👆
          </p>
        </div>
      )}
    </div>
  );
}

export default Flashcard;