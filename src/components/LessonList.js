'use client';

import { useState, useEffect } from 'react';
import { lessonService } from '@/services/api/lessonService';

export default function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState('Q1');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const data = await lessonService.getLessonsByQuarter(year, quarter);
        setLessons(data.data || data); // Handle both response formats
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [year, quarter]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Trigger re-fetch with new parameters
  };

  if (loading) {
    return <div>Loading lessons...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Lessons by Quarter</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            min="2020"
            max="2030"
          />
        </div>
        <div>
          <label>Quarter:</label>
          <select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
        </div>
        <button type="submit">Search</button>
      </form>
      
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            <p>Year: {lesson.year}, Quarter: {lesson.quarter}</p>
            {lesson.language && <p>Language: {lesson.language.name}</p>}
            <p>Status: {lesson.isPublished ? 'Published' : 'Draft'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}