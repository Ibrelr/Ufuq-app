import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LanguageProvider } from './i18n/LanguageProvider'
import { ProgressProvider } from './lib/progress'
import { SpeakProvider } from './lib/useSpeak'
import { StatsProvider } from './lib/stats'
import { Home } from './pages/Home'
import { LevelPage } from './pages/LevelPage'
import { NotFound } from './pages/NotFound'
import { TopicPage } from './pages/TopicPage'
import { SearchPage } from './pages/SearchPage'
import { SavedPage } from './pages/SavedPage'
import { ReviewPage } from './pages/ReviewPage'
import { ProgressPage } from './pages/ProgressPage'
import { ConversationPage } from './pages/ConversationPage'
import { ReadingPage } from './pages/ReadingPage'
import { LessonListPage } from './pages/LessonListPage'
import { GrammarPage } from './pages/GrammarPage'
import { CoursePage } from './pages/CoursePage'

export default function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <StatsProvider>
        <SpeakProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="level/:levelId" element={<LevelPage />} />
                <Route path="topic/:topicId/:mode?" element={<TopicPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="saved" element={<SavedPage />} />
                <Route path="review" element={<ReviewPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="talk" element={<LessonListPage kind="talk" />} />
                <Route path="talk/:id/:mode?" element={<ConversationPage />} />
                <Route path="read" element={<LessonListPage kind="read" />} />
                <Route path="grammar" element={<LessonListPage kind="grammar" />} />
                <Route path="grammar/:id/:mode?" element={<GrammarPage />} />
                <Route path="course" element={<CoursePage />} />
                <Route path="read/:id/:mode?" element={<ReadingPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SpeakProvider>
        </StatsProvider>
      </ProgressProvider>
    </LanguageProvider>
  )
}
