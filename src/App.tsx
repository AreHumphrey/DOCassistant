import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MenuPage from './pages/MenuPage'
import AnamnesesPage from './pages/AnamnesesPage'
import SavedPromptPage from './pages/SavedPromptPage'
import LabPage from './pages/LabPage'
import DrugPage from './pages/DragPage'
import FilesPage from './pages/FilesPage'
import AnswerPage from './pages/AnswerPage'
import ProfilePage from './pages/ProfilePage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import NewPasswordPage from './pages/NewPasswordPage'
import HistoryPage from './pages/HistoryPage'
import PatientsPage from './pages/PatientsPage'
import RadPage from './pages/RadPage'
import CarPage from './pages/CarPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MenuPage />} />
          <Route path="/med" element={<AnamnesesPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/saved-prompts" element={<SavedPromptPage />} />
          <Route path="/ai/lab" element={<LabPage />} />
          <Route path="/ai/far" element={<DrugPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/ai/rad" element={<RadPage/>} />
          <Route path="/ai/car" element={<CarPage/>} />
          <Route path="/answer" element={<AnswerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/reset-password/:token" element={<NewPasswordPage />} />
          <Route path="/patients" element={<PatientsPage />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
