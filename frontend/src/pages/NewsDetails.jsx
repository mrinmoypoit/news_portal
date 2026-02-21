import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [newComment, setNewComment] = useState("");
  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    fetch(`http://localhost:5000/api/news/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setArticle(data.data);
        }
      })
      .catch(err => console.error('Error fetching news:', err));
  }, [id]);

  const postComment = (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");

    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:5000/api/comments/news/${id}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text: newComment })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Refresh the article to get updated comments
        fetch(`http://localhost:5000/api/news/${id}`)
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              setArticle(result.data);
              setNewComment("");
            }
          });
      }
    })
    .catch(err => console.error('Error posting comment:', err));
  };

  if (!article) return <p className="text-center mt-10">Loading article...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-black mb-4">{article.title}</h1>
      <p className="text-gray-700 leading-relaxed mb-10">{article.body}</p>

      <div className="border-t pt-8">
        <h3 className="text-xl font-bold mb-4">Comments ({article.comments?.length || 0})</h3>
        <form onSubmit={postComment} className="mb-6 flex gap-2">
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)} 
                 placeholder="Write a comment..." className="flex-1 border p-2 rounded" required />
          <button type="submit" className="bg-gray-800 text-white px-4 rounded">Post</button>
        </form>
        <div className="space-y-4">
          {article.comments?.map(c => (
            <div key={c.id} className="p-4 bg-white border rounded shadow-sm text-sm">
              <span className="font-bold text-blue-600 block">{c.user?.name || 'User'}</span>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}