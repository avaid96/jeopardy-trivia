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

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Questions</h2>
      {topics.map(topic => (
        <div key={topic} className="mb-4">
          <h3 className="text-lg font-medium mb-2">{topic}</h3>
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <th className="w-1/12 px-2 py-1 border bg-gray-50">Points</th>
                <th className="w-5/12 px-2 py-1 border bg-gray-50">Question</th>
                <th className="w-5/12 px-2 py-1 border bg-gray-50">Answer</th>
                <th className="w-1/12 px-2 py-1 border bg-gray-50">Actions</th>
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
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(q)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
      
      {editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow w-1/2">
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