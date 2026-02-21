import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    // Get current news data
    fetch(`http://localhost:5000/api/news/${id}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const data = result.data;
          // Security Check: Ensure the logged-in user is the actual author
          if (data.authorId !== user.id) {
            alert("Unauthorized access");
            navigate('/');
          } else {
            setNews({ title: data.title, body: data.body });
            setLoading(false);
          }
        }
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        navigate('/');
      });
  }, [id, navigate, user.id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Perform Update via PUT
    fetch(`http://localhost:5000/api/news/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(news)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Post updated successfully!");
        navigate(`/news/${id}`);
      } else {
        alert(data.message || "Failed to update post");
      }
    })
    .catch(err => {
      console.error('Error updating:', err);
      alert("Error updating post");
    });
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading editor...</p>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 bg-white shadow-2xl rounded-3xl mt-10">
      <h1 className="text-3xl font-black mb-8 text-center">Edit Post</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Headline</label>
          <input
            type="text"
            value={news.title}
            onChange={(e) => setNews({ ...news, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
          <textarea
            rows="8"
            value={news.body}
            onChange={(e) => setNews({ ...news, body: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none transition-all resize-none"
          />
        </div>
        <div className="flex justify-between items-center">
          <button type="button" onClick={() => navigate(-1)} className="text-gray-500 font-semibold">Cancel</button>
          <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}