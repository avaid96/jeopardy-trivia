// src/components/QuestionList.jsx
import React, { useState } from 'react';

function QuestionList({ questions, setQuestions, topics, apiKey }) {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');

  const handleEdit = (question) => {
    setEditingQuestion(question.id);
    setEditedQuestion(question.question);
    setEditedAnswer(question.answer);
  };

  const handleSave = () => {
    const updatedQuestions = questions.map(q => {
      if (q.id === editingQuestion) {
        return { ...q, question: editedQuestion, answer: editedAnswer };
      }
      return q;
    });
    setQuestions(updatedQuestions);
    setEditingQuestion(null);
  };

  const handleAddManualQuestion = (topic) => {
    const newQuestion = {
      id: `${topic}-${Date.now()}`,
      topic,
      question: '',
      answer: '',
      points: 100,
      seen: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Questions</h2>
      {topics.map(topic => (
        <div key={topic} className="mb-4">
          <h3 className="text-lg font-medium">{topic}</h3>
          <table className="w-full table-auto mt-2">
            <thead>
              <tr>
                <th className="px-2 py-1 border">Points</th>
                <th className="px-2 py-1 border">Question</th>
                <th className="px-2 py-1 border">Answer</th>
                <th className="px-2 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions
                .filter(q => q.topic === topic)
                .map(q => (
                  <tr key={q.id}>
                    <td className="px-2 py-1 border text-center">{q.points}</td>
                    <td className="px-2 py-1 border">{q.question}</td>
                    <td className="px-2 py-1 border">{q.answer}</td>
                    <td className="px-2 py-1 border text-center">
                      <button
                        className="text-blue-500 mr-2"
                        onClick={() => handleEdit(q)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!apiKey && (
            <button
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
              onClick={() => handleAddManualQuestion(topic)}
            >
              Add Question
            </button>
          )}
        </div>
      ))}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow w-1/3">
            <h3 className="text-lg font-semibold mb-2">Edit Question</h3>
            <input
              type="text"
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              placeholder="Question"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              placeholder="Answer"
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => setEditingQuestion(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionList;