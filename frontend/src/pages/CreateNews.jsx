import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function CreateNews() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  // Retrieve the logged-in user from localStorage to use as author_id
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const handlePostNews = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to post news.");
    
    setLoading(true);

    const newPost = {
      title,
      body,
      author_id: user.id, // Mandatory author association
      comments: []        // Nested structure initialization
    };

    try {
      const response = await fetch('http://localhost:3000/news', {
        method: 'POST', // Create method as per your map
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        alert("News successfully published!");
        navigate('/'); // Redirect to news feed
      }
    } catch (error) {
      console.error("Error posting news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 bg-white shadow-2xl rounded-3xl border border-gray-100 mt-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900">Create News Post</h1>
        <p className="text-gray-500 mt-2 italic">Posting as: <span className="font-bold text-blue-600">{user?.name}</span></p>
      </div>

      <form onSubmit={handlePostNews} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Headline</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Local Startup Wins Innovation Award"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">News Content</label>
          <textarea 
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="6"
            placeholder="Describe the news in detail..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="text-gray-500 font-semibold hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'}`}
          >
            {loading ? 'Publishing...' : 'Publish News'}
          </button>
        </div>
      </form>
    </div>
  );
}