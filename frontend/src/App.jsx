import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import NewsFeed from './pages/NewsFeed';
import CreateNews from './pages/CreateNews';
import NewsDetails from './pages/NewsDetails';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Import your logic
import EditNews from './pages/EditNews';

export default function App() {
  return (
    < >
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="container mx-auto py-8 px-4 flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<NewsFeed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/news/:id" element={<NewsDetails />} />

            {/* Protected Routes */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateNews />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditNews />
                </ProtectedRoute>
              }
            />

            {/* Fallback for undefined routes */}
            <Route path="*" element={<div className="text-center mt-20">404: Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </ >
  );
}