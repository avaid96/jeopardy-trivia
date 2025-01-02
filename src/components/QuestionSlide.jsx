// src/components/QuestionSlide.jsx
import React, { useState } from 'react';

function QuestionSlide({ question, onClose }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-2/3 max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">
          {question.topic} - {question.points} Points
        </h3>
        <p className="mb-6 text-lg">{question.question}</p>
        
        {!showAnswer ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            onClick={() => setShowAnswer(true)}
          >
            Reveal Answer
          </button>
        ) : (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Answer:</h4>
            <p className="text-lg">{question.answer}</p>
          </div>
        )}
        
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default QuestionSlide;