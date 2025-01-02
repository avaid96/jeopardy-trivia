// src/components/QuestionSlide.jsx
import React from 'react';

function QuestionSlide({ question, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-2/3">
        <h3 className="text-xl font-semibold mb-4">Question for {question.points} Points</h3>
        <p className="mb-4">{question.question}</p>
        <p className="mb-4"><strong>Answer:</strong> {question.answer}</p>
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