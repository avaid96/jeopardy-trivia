// src/components/TopicInput.jsx
import React, { useState } from 'react';
import OpenAI from 'openai';

function TopicInput({ topics, setTopics, apiKey, setApiKey, setQuestions }) {
  const [newTopics, setNewTopics] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleTopicChange = (index, value) => {
    const updatedTopics = [...newTopics];
    updatedTopics[index] = value;
    setNewTopics(updatedTopics);
  };

  const generateQuestions = async () => {
    if (!apiKey) {
      alert('OpenAI API key is missing. Please enter questions manually.');
      return;
    }

    setLoading(true);
    const generatedQuestions = [];
    const openai = new OpenAI({ 
      apiKey, 
      dangerouslyAllowBrowser: true
    });

    try {
      for (const topic of newTopics) {
        if (topic.trim() === '') continue;
        
        for (let points = 100; points <= 500; points += 100) {
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
              role: "user",
              content: `Create a trivia question for the topic "${topic}" with a difficulty level worth ${points} points. Format the response exactly like this example:
              Question: Which planet is known as the Red Planet?
              Answer: Mars`
            }],
            temperature: 0.7,
          });

          const text = response.choices[0].message.content.trim();
          const [question, answer] = text.split('\n').map(s => s.trim());

          generatedQuestions.push({
            id: `${topic}-${points}`,
            topic,
            question: question.replace(/^Question:\s*/, ''),
            answer: answer.replace(/^Answer:\s*/, ''),
            points,
            seen: false,
          });
        }
      }

      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error generating question:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createEmptyQuestions = () => {
    const emptyQuestions = [];
    newTopics.forEach(topic => {
      if (topic.trim() === '') return;
      
      for (let points = 100; points <= 500; points += 100) {
        emptyQuestions.push({
          id: `${topic}-${points}`,
          topic,
          question: '',
          answer: '',
          points,
          seen: false,
        });
      }
    });
    setQuestions(emptyQuestions);
  };

  const saveTopics = async () => {
    const validTopics = newTopics.filter(topic => topic.trim() !== '');
    if (validTopics.length === 0) {
      alert('Please enter at least one topic.');
      return;
    }
    setTopics(validTopics);

    if (apiKey) {
      await generateQuestions();
    } else {
      createEmptyQuestions();
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Enter Topics</h2>
      {newTopics.map((topic, index) => (
        <input
          key={index}
          type="text"
          value={topic}
          onChange={(e) => handleTopicChange(index, e.target.value)}
          placeholder={`Topic ${index + 1}`}
          className="w-full mb-2 p-2 border rounded"
        />
      ))}
      <h2 className="text-xl font-semibold mt-4 mb-2">OpenAI API Key (Optional)</h2>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your OpenAI API Key"
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={saveTopics}
        disabled={loading}
      >
        {loading ? 'Generating...' : (apiKey ? 'Save Topics & Generate Questions' : 'Save Topics')}
      </button>
      {!apiKey && (
        <p className="text-sm text-gray-500 mt-2">
          Without an OpenAI API key, you'll need to enter questions manually in Step 2.
        </p>
      )}
    </div>
  );
}

export default TopicInput;