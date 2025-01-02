// src/components/TopicInput.jsx
import React, { useState } from 'react';
import OpenAI from 'openai';

function TopicInput({ topics, setTopics, apiKey, setApiKey, setQuestions }) {
  const [newTopics, setNewTopics] = useState([
    { name: '', context: '' },
    { name: '', context: '' },
    { name: '', context: '' },
    { name: '', context: '' },
    { name: '', context: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState(0);

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...newTopics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    setNewTopics(updatedTopics);
  };

  // Helper function to calculate cost (based on GPT-3.5-turbo pricing)
  const calculateCost = (promptTokens, completionTokens) => {
    // Current pricing: $0.0015 per 1K input tokens, $0.002 per 1K output tokens
    return (promptTokens * 0.0015 + completionTokens * 0.002) / 1000;
  };

  const generateQuestions = async () => {
    if (!apiKey) {
      alert('OpenAI API key is missing. Please enter questions manually.');
      return;
    }

    setLoading(true);
    setCost(0);
    const generatedQuestions = [];
    const openai = new OpenAI({ 
      apiKey, 
      dangerouslyAllowBrowser: true
    });

    let totalCost = 0;

    try {
      for (const topic of newTopics) {
        if (topic.name.trim() === '') continue;
        
        const contextPrompt = topic.context.trim() 
          ? `Generate questions appropriate ${topic.context}.`
          : '';

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: `Create 5 trivia questions for the topic "${topic.name}" with increasing difficulty levels from easy to very challenging. ${contextPrompt}

            Format them exactly like this example:
            100 Points
            Question: What is the capital of France?
            Answer: Paris
            
            200 Points
            Question: Which river is the longest in Europe?
            Answer: Volga River
            
            (continue with 300, 400, and 500 points)`
          }],
          temperature: 0.7,
        });

        // Calculate cost for this request
        const requestCost = calculateCost(
          response.usage.prompt_tokens,
          response.usage.completion_tokens
        );
        totalCost += requestCost;

        const text = response.choices[0].message.content.trim();
        const questionBlocks = text.split(/\d{3} Points/).filter(block => block.trim());

        questionBlocks.forEach((block, index) => {
          const points = (index + 1) * 100;
          const [question, answer] = block.trim().split('\n').map(s => s.trim());
          
          generatedQuestions.push({
            id: `${topic.name}-${points}`,
            topic: topic.name,
            question: question.replace(/^Question:\s*/, ''),
            answer: answer.replace(/^Answer:\s*/, ''),
            points,
            seen: false,
          });
        });
      }

      setQuestions(generatedQuestions);
      setCost(totalCost);
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
      if (topic.name.trim() === '') return;
      
      for (let points = 100; points <= 500; points += 100) {
        emptyQuestions.push({
          id: `${topic.name}-${points}`,
          topic: topic.name,
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
    const validTopics = newTopics.filter(topic => topic.name.trim() !== '');
    if (validTopics.length === 0) {
      alert('Please enter at least one topic.');
      return;
    }
    setTopics(validTopics.map(t => t.name));

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
        <div key={index} className="mb-4">
          <input
            type="text"
            value={topic.name}
            onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
            placeholder={`Topic ${index + 1}`}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            value={topic.context}
            onChange={(e) => handleTopicChange(index, 'context', e.target.value)}
            placeholder="Optional: Add context to help generate appropriate questions (e.g., 'for beginners', 'college level')"
            className="w-full p-2 border rounded text-sm text-gray-600"
          />
        </div>
      ))}
      
      <h2 className="text-xl font-semibold mt-4 mb-2">OpenAI API Key (Optional)</h2>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your OpenAI API Key"
        className="w-full mb-4 p-2 border rounded font-mono [--webkit-text-security:disc]"
        style={{ WebkitTextSecurity: 'disc' }}
        autoComplete="off"
      />
      
      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={saveTopics}
        disabled={loading}
      >
        {loading ? 'Generating...' : (apiKey ? 'Save Topics & Generate Questions' : 'Save Topics')}
      </button>
      
      {cost > 0 && (
        <p className="text-sm text-gray-600 mt-2">
          OpenAI API cost for question generation: ${cost.toFixed(4)}
        </p>
      )}
      
      {!apiKey ? (
        <p className="text-sm text-gray-500 mt-2">
          Without an OpenAI API key, you'll need to enter questions manually in Step 2.
        </p>
      ) : (
        <p className="text-sm text-gray-500 mt-2">
          Questions will be generated using OpenAI's API. Approximate cost: $0.02
        </p>
      )}
    </div>
  );
}

export default TopicInput;