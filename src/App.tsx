import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LanguageProvider } from './i18n/LanguageProvider'
import { ProgressProvider } from './lib/progress'
import { SpeakProvider } from './lib/useSpeak'
import { Home } from './pages/Home'
import { LevelPage } from './pages/LevelPage'
import { NotFound } from './pages/NotFound'
import { TopicPage } from './pages/TopicPage'

export default function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <SpeakProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="level/:levelId" element={<LevelPage />} />
                <Route path="topic/:topicId" element={<TopicPage mode="learn" />} />
                <Route path="topic/:topicId/quiz" element={<TopicPage mode="quiz" />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SpeakProvider>
      </ProgressProvider>
    </LanguageProvider>
  )
}
