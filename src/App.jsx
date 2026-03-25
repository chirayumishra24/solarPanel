import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import './App.css';
import { SolarCourseBackground } from './components/SolarCourseBackground';
import { ChapterLayout } from './components/ChapterLayout';
import { chapters } from './data/chapters';

function CourseContent() {
  const { moduleId, chapterId } = useParams();
  const key = `${moduleId}-${chapterId}`;
  const chapterData = chapters[key];

  if (!chapterData) {
    return <div style={{ color: 'white', padding: '4rem', zIndex: 100, position: 'relative' }}>Chapter Not Found</div>;
  }

  return <ChapterLayout chapterData={chapterData} />;
}

function App() {
  return (
    <BrowserRouter>
      <SolarCourseBackground>
        <Routes>
          <Route path="/" element={<Navigate to="/module/1/chapter/1" replace />} />
          <Route path="/module/:moduleId/chapter/:chapterId" element={<CourseContent />} />
        </Routes>
      </SolarCourseBackground>
    </BrowserRouter>
  );
}

export default App;
