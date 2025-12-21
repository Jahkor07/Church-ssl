'use client';

import { useState } from 'react';
import { lessonService } from '@/services/api/lessonService';

export default function LessonForm({ onSuccess, initialData = null }) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    introduction: initialData?.introduction || '',
    year: initialData?.year || new Date().getFullYear(),
    quarter: initialData?.quarter || 'Q1',
    keywords: initialData?.keywords || '',
    isPublished: initialData?.isPublished || false,
    order: initialData?.order || 0,
    languageId: initialData?.language?.id || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await lessonService.updateLesson(initialData.id, formData);
      } else {
        await lessonService.createLesson(formData);
      }
      
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{isEditing ? 'Edit Lesson' : 'Create New Lesson'}</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div>
          <label>Content:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            required
          />
        </div>
        
        <div>
          <label>Introduction:</label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <div>
          <label>Year:</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="2020"
            max="2030"
            required
          />
        </div>
        
        <div>
          <label>Quarter:</label>
          <select
            name="quarter"
            value={formData.quarter}
            onChange={handleChange}
            required
          >
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
        </div>
        
        <div>
          <label>Keywords:</label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label>Language ID:</label>
          <input
            type="number"
            name="languageId"
            value={formData.languageId}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            Published
          </label>
        </div>
        
        <div>
          <label>Order:</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Lesson' : 'Create Lesson')}
        </button>
      </form>
    </div>
  );
}