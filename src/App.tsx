import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (audioRef.current) {
      audioRef.current.play();
    }
    // Visual notification
    document.title = "Time's up! - Pomodoro";
    setTimeout(() => {
      document.title = "Pomodoro Timer";
    }, 3000);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes * 60);
  };

  const updateCustomTime = (minutes: number) => {
    if (minutes > 0 && minutes <= 120) {
      setCustomMinutes(minutes);
      setTimeLeft(minutes * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((customMinutes * 60 - timeLeft) / (customMinutes * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="relative">
          {/* Progress Circle */}
          <div className="w-64 h-64 mx-auto relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#e2e8f0"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#6366f1"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-6xl font-bold text-gray-800">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={toggleTimer}
              className="p-4 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 transition-colors"
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={resetTimer}
              className="p-4 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <RotateCcw size={24} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-4 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <Settings size={24} />
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Custom Timer</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customMinutes}
                  onChange={(e) => updateCustomTime(parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border rounded-md"
                />
                <span className="text-gray-600">minutes</span>
              </div>
            </div>
          )}
        </div>

        {/* Audio Element */}
        <audio ref={audioRef}>
          <source src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
}

export default App;