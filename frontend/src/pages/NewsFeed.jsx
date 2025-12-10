import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function NewsFeed() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get logged-in user to check ownership
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const fetchNews = () => {
        fetch('http://localhost:3000/news')
            .then(res => res.json())
            .then(data => {
                setNews(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this news post?")) {
            fetch(`http://localhost:3000/news/${id}`, {
                method: 'DELETE', // Delete method as per map
            }).then(() => {
                // Update local state after successful deletion
                setNews(news.filter(item => item.id !== id));
            });
        }
    };

    if (loading) return <div className="text-center mt-20 text-gray-500">Loading your feed...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-black text-gray-900">Portal Feed</h1>
                {currentUser && (
                    <Link to="/create" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all">
                        + New Post
                    </Link>
                )}
            </div>

            <div className="grid gap-6">
                {news.length === 0 ? (
                    <p className="text-center text-gray-500 py-20">No news yet. Be the first to post!</p>
                ) : (
                    news.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <Link to={`/news/${item.id}`} className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </Link>
                                    <p className="mt-3 text-gray-600 leading-relaxed">
                                        {item.body.length > 150 ? `${item.body.substring(0, 150)}...` : item.body}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t pt-4 border-gray-50">
                                <div className="flex gap-4 text-sm text-gray-400 font-medium">
                                    <span>💬 {item.comments?.length || 0} comments</span>
                                    <span>👤 Author ID: {item.author_id}</span>
                                </div>

                                <div className="flex gap-2">
                                    <Link to={`/news/${item.id}`} className="text-sm font-bold text-blue-500 hover:underline">
                                        Read More →
                                    </Link>

                                    {currentUser && currentUser.id === item.author_id && (
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/edit/${item.id}`}
                                                className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors px-3 py-1 bg-gray-50 rounded-lg"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors px-3 py-1 bg-red-50 rounded-lg"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}