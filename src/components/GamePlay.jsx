// src/components/GamePlay.jsx
import React, { useState } from 'react';
import QuestionSlide from './QuestionSlide';

function GamePlay({ questions: initialQuestions }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState(initialQuestions);

  const handleQuestionClick = (question) => {
    setCurrentQuestion(question);
    if (!question.seen) {
      markAsSeen(question.id);
    }
  };

  const markAsSeen = (id) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => {
        if (q.id === id) {
          return { ...q, seen: true };
        }
        return q;
      })
    );
  };

  // Organize questions by topic and points
  const topics = [...new Set(questions.map(q => q.topic))];
  const pointLevels = [100, 200, 300, 400, 500];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Game Board</h2>
      
      {/* Categories Row */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {topics.map(topic => (
          <div key={topic} className="bg-blue-600 text-white p-3 rounded text-center font-semibold">
            {topic}
          </div>
        ))}
      </div>

      {/* Questions Grid */}
      {pointLevels.map(points => (
        <div key={points} className="grid grid-cols-5 gap-4 mb-4">
          {topics.map(topic => {
            const question = questions.find(q => q.topic === topic && q.points === points);
            return (
              <button
                key={`${topic}-${points}`}
                className={`p-4 text-xl font-bold rounded transition-colors
                  ${question?.seen 
                    ? 'bg-gray-400 text-gray-600 hover:bg-gray-500'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                onClick={() => question && handleQuestionClick(question)}
              >
                {points}
              </button>
            );
          })}
        </div>
      ))}

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