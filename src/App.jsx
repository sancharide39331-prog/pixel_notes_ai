import Flashcard from "./components/Flashcard";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("summary");
  const [currentCard, setCurrentCard] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    try {
      setLoading(true);
      setResult("");
      setCurrentCard(0);

      const response = await fetch(
        "http://127.0.0.1:5000/summarize",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const flashcards =
    mode === "flashcards" && result
      ? result
          .split(/Card \d+/)
          .filter((card) => card.trim())
          .map((card) => {
            const questionMatch = card.match(
              /Question:(.*?)(?=Answer:)/s
            );

            const answerMatch = card.match(
              /Answer:(.*)/s
            );

            return {
              question:
                questionMatch?.[1]?.trim() ||
                "Question not found",

              answer:
                answerMatch?.[1]?.trim() ||
                "Answer not found",
            };
          })
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 flex items-center justify-center p-6">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/50 w-full max-w-5xl">

        {/* Title */}
        <h1 className="text-5xl font-bold text-purple-700 text-center">
          PixelNotes AI 🌸
        </h1>

        <p className="text-gray-600 mt-4 text-center text-lg">
          Upload your notes and choose your study mode ✨
        </p>

        {/* Upload */}
        <div className="mt-10">
          <label className="cursor-pointer block">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="bg-pink-200 hover:bg-pink-300 text-purple-700 py-4 rounded-2xl text-center font-semibold transition text-lg shadow-md">
              Choose PDF 📄
            </div>
          </label>
        </div>

        {/* Selected File */}
        {file && (
          <div className="mt-5 text-center text-gray-700 bg-pink-50 p-3 rounded-xl">
            Selected File:
            <span className="font-semibold">
              {" "}
              {file.name}
            </span>
          </div>
        )}

        {/* Modes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">

          <button
            onClick={() => setMode("summary")}
            className={`p-3 rounded-2xl font-semibold transition ${
              mode === "summary"
                ? "bg-purple-600 text-white"
                : "bg-pink-100 text-purple-700"
            }`}
          >
            📝 Summary
          </button>

          <button
            onClick={() => setMode("flashcards")}
            className={`p-3 rounded-2xl font-semibold transition ${
              mode === "flashcards"
                ? "bg-purple-600 text-white"
                : "bg-pink-100 text-purple-700"
            }`}
          >
            🧠 Flashcards
          </button>

          <button
            onClick={() => setMode("quiz")}
            className={`p-3 rounded-2xl font-semibold transition ${
              mode === "quiz"
                ? "bg-purple-600 text-white"
                : "bg-pink-100 text-purple-700"
            }`}
          >
            ❓ Quiz
          </button>

          <button
            onClick={() => setMode("deepstudy")}
            className={`p-3 rounded-2xl font-semibold transition ${
              mode === "deepstudy"
                ? "bg-purple-600 text-white"
                : "bg-pink-100 text-purple-700"
            }`}
          >
            📚 Deep Study
          </button>

          <button
            onClick={() => setMode("lastminute")}
            className={`p-3 rounded-2xl font-semibold transition ${
              mode === "lastminute"
                ? "bg-purple-600 text-white"
                : "bg-pink-100 text-purple-700"
            }`}
          >
            ⚡ Last Minute
          </button>

        </div>

        {/* Generate */}
        <button
          onClick={handleUpload}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl transition text-lg font-semibold shadow-lg"
        >
          Generate ✨
        </button>

        {/* Loading */}
        {loading && (
          <div className="mt-10 flex flex-col items-center">

            <div className="w-16 h-16 border-4 border-pink-300 border-t-purple-700 rounded-full animate-spin"></div>

            <p className="mt-4 text-purple-700 font-semibold text-lg">
              AI is studying your notes... 🤖
            </p>

          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-10 bg-pink-50 p-8 rounded-3xl shadow-inner">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-3xl font-bold text-purple-700">
                AI Result ✨
              </h2>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(result)
                }
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
              >
                📋 Copy
              </button>

            </div>

            {mode === "flashcards" ? (

              <div className="flex flex-col items-center">

                {flashcards.length > 0 && (

                  <>
                    <Flashcard
                      question={
                        flashcards[currentCard].question
                      }
                      answer={
                        flashcards[currentCard].answer
                      }
                    />

                    <div className="flex gap-4 mt-6">

                      <button
                        onClick={() =>
                          setCurrentCard(
                            currentCard === 0
                              ? flashcards.length - 1
                              : currentCard - 1
                          )
                        }
                        className="bg-pink-400 text-white px-6 py-3 rounded-xl"
                      >
                        ⬅ Previous
                      </button>

                      <button
                        onClick={() =>
                          setCurrentCard(
                            (currentCard + 1) %
                              flashcards.length
                          )
                        }
                        className="bg-purple-600 text-white px-6 py-3 rounded-xl"
                      >
                        Next ➡
                      </button>

                    </div>

                    <p className="mt-4 text-purple-700 font-semibold">
                      Card {currentCard + 1} of{" "}
                      {flashcards.length}
                    </p>

                  </>

                )}

              </div>

            ) : (

              <div className="prose max-w-none">
                <ReactMarkdown>
                  {result}
                </ReactMarkdown>
              </div>

            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default App;