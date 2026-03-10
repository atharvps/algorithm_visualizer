import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import useAuthStore from '@/store/authStore'

// Layout
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import ProfilePage from '@/pages/ProfilePage'
import SortingPage from '@/pages/SortingPage'
import SearchingPage from '@/pages/SearchingPage'
import GraphPage from '@/pages/GraphPage'
import TreePage from '@/pages/TreePage'
import LinkedListPage from '@/pages/LinkedListPage'
import StackQueuePage from '@/pages/StackQueuePage'
import DPPage from '@/pages/DPPage'
import SlidingWindowPage from '@/pages/SlidingWindowPage'
import RecursionPage from '@/pages/RecursionPage'
import StringAlgoPage from '@/pages/StringAlgoPage'
import ComplexityPage from '@/pages/ComplexityPage'
import RaceModePage from '@/pages/RaceModePage'
import FavoritesPage from '@/pages/FavoritesPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  const { fetchMe, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) fetchMe()
  }, [])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#111c2e',
            color: '#e2e8f0',
            border: '1px solid rgba(0,229,255,0.2)',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#00ff88', secondary: '#020409' } },
          error:   { iconTheme: { primary: '#ff4757', secondary: '#020409' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* App with layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />

          {/* Visualizers - accessible without auth */}
          <Route path="/sorting"        element={<SortingPage />} />
          <Route path="/searching"      element={<SearchingPage />} />
          <Route path="/graph"          element={<GraphPage />} />
          <Route path="/tree"           element={<TreePage />} />
          <Route path="/linked-list"    element={<LinkedListPage />} />
          <Route path="/stack-queue"    element={<StackQueuePage />} />
          <Route path="/dynamic-programming" element={<DPPage />} />
          <Route path="/sliding-window" element={<SlidingWindowPage />} />
          <Route path="/recursion"      element={<RecursionPage />} />
          <Route path="/string-algo"    element={<StringAlgoPage />} />
          <Route path="/complexity"     element={<ComplexityPage />} />
          <Route path="/race-mode"      element={<RaceModePage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*"    element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
