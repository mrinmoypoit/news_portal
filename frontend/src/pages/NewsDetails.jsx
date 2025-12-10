import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [newComment, setNewComment] = useState("");
  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    fetch(`http://localhost:3000/news/${id}`).then(res => res.json()).then(setArticle);
  }, [id]);

  const postComment = (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");

    const commentData = {
      id: Date.now(),
      text: newComment,
      user_id: user.id,
      timestamp: new Date().toISOString()
    };

    const updatedComments = [...article.comments, commentData];

    // PATCH to update the nested comments list as per your Route Map
    fetch(`http://localhost:3000/news/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments: updatedComments })
    }).then(() => {
      setArticle({ ...article, comments: updatedComments });
      setNewComment("");
    });
  };

  if (!article) return <p className="text-center mt-10">Loading article...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-black mb-4">{article.title}</h1>
      <p className="text-gray-700 leading-relaxed mb-10">{article.body}</p>

      <div className="border-t pt-8">
        <h3 className="text-xl font-bold mb-4">Comments ({article.comments.length})</h3>
        <form onSubmit={postComment} className="mb-6 flex gap-2">
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)} 
                 placeholder="Write a comment..." className="flex-1 border p-2 rounded" />
          <button type="submit" className="bg-gray-800 text-white px-4 rounded">Post</button>
        </form>
        <div className="space-y-4">
          {article.comments.map(c => (
            <div key={c.id} className="p-4 bg-white border rounded shadow-sm text-sm">
              <span className="font-bold text-blue-600 block">User ID: {c.user_id}</span>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}