import { useState, useEffect } from "react";

function App() {
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);

          const audio = new Audio(
            "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
          );
          audio.play().catch((err) => console.log("Audio play failed:", err));

          if (mode === "work") {
            setSessionsCompleted((prevSessions) => prevSessions + 1);
            setMode("break");
            return 300;
          } else {
            setMode("work");
            return 1500;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div
      className={`min-h-screen py-8 px-4 transition-colors duration-500 ${
        mode === "work" ? "bg-blue-50" : "bg-green-50"
      }`}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Pomodoro Timer
          </h1>

          <p
            className={`text-6xl font-bold text-center mb-8 transition-colors duration-500 ${
              mode === "work" ? "text-blue-600" : "text-green-600"
            }`}
          >
            {formatTime(timeLeft)}
          </p>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                mode === "work" ? "bg-blue-600" : "bg-green-600"
              }`}
              style={{
                width: `${(timeLeft / (mode === "work" ? 1500 : 300)) * 100}%`,
              }}
            ></div>
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className=" bg-green-500 hover:bg-green-600 rounded-lg font-medium text-white px-6 py-3"
            >
              {isRunning ? "Pause" : "Start"}
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                mode === "work" ? setTimeLeft(1500) : setTimeLeft(300);
              }}
              className=" bg-gray-500 hover:bg-gray-600 rounded-lg font-medium text-white px-6 py-3"
            >
              Reset
            </button>
          </div>

          <div className="text-center">
            <p
              className={`text-lg font-semibold mb-2 transition-colors duration-500 ${
                mode === "work" ? "text-blue-700" : "text-green-700"
              }`}
            >
              {mode === "work" ? "Work Session" : "Break Time"}
            </p>
            <p className="text-sm text-gray-600">
              Sessions completed: {sessionsCompleted}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
