// src/components/GamePlay.jsx
import React, { useState } from 'react';
import QuestionSlide from './QuestionSlide';

function GamePlay({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const handleQuestionClick = (question) => {
    setCurrentQuestion(question);
  };

  const markAsSeen = (id) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === id) {
        return { ...q, seen: true };
      }
      return q;
    });
    // Since there's no backend, we won't persist this change
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-center">Play Game</h2>
      <div className="grid grid-cols-5 gap-4">
        {questions.map(q => (
          <button
            key={q.id}
            className={`p-4 bg-blue-500 text-white rounded ${
              q.seen ? 'bg-gray-400' : 'hover:bg-blue-600'
            }`}
            onClick={() => {
              handleQuestionClick(q);
              markAsSeen(q.id);
            }}
            disabled={q.seen}
          >
            {q.points}
          </button>
        ))}
      </div>
      {currentQuestion && (
        <QuestionSlide
          question={currentQuestion}
          onClose={() => setCurrentQuestion(null)}
        />
      )}
    </div>
  );
}

export default GamePlay;