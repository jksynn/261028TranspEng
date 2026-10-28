import QuestionsPage from './pages/QuestionsPage'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ResearchListPage from './pages/ResearchListPage'
import ResearchDetailPage from './pages/ResearchDetailPage'
import LecturesPage from './pages/LecturesPage'
import DiscussionsPage from './pages/DiscussionsPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/research" element={<ResearchListPage />} />
        <Route path="/research/:id" element={<ResearchDetailPage />} />
        <Route path="/lectures" element={<LecturesPage />} />
        <Route path="/discussions" element={<DiscussionsPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
