// src/App.jsx
import React, { useState, useEffect } from 'react';
import TopicInput from './components/TopicInput';
import QuestionList from './components/QuestionList';
import GamePlay from './components/GamePlay';

function App() {
  const [topics, setTopics] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [questions, setQuestions] = useState([]);
  const [gamePublished, setGamePublished] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTopics = JSON.parse(localStorage.getItem('topics')) || [];
    const savedApiKey = localStorage.getItem('apiKey') || '';
    const savedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
    const savedGameStatus = JSON.parse(localStorage.getItem('gamePublished')) || false;

    setTopics(savedTopics);
    setApiKey(savedApiKey);
    setQuestions(savedQuestions);
    setGamePublished(savedGameStatus);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('topics', JSON.stringify(topics));
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('questions', JSON.stringify(questions));
    localStorage.setItem('gamePublished', JSON.stringify(gamePublished));
  }, [topics, apiKey, questions, gamePublished]);

  const validateQuestions = () => {
    const hasEmptyQuestions = questions.some(q => !q.question.trim() || !q.answer.trim());
    if (hasEmptyQuestions) {
      alert('All questions must be filled out before publishing the game.');
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Jeopardy-Style Trivia Game</h1>
      {!gamePublished ? (
        <>
          <TopicInput
            topics={topics}
            setTopics={setTopics}
            apiKey={apiKey}
            setApiKey={setApiKey}
            setQuestions={setQuestions}
          />
          <QuestionList
            questions={questions}
            setQuestions={setQuestions}
            topics={topics}
            apiKey={apiKey}
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              if (validateQuestions()) {
                setGamePublished(true);
              }
            }}
            disabled={questions.length === 0}
          >
            Publish Game
          </button>
        </>
      ) : (
        <GamePlay questions={questions} />
      )}
    </div>
  );
}

export default App;