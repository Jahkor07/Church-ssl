'use client';

import { useState, useEffect } from 'react';
import { languageService } from '@/services/api/languageService';

export default function LanguageList() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const data = await languageService.getAllLanguages();
        setLanguages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  if (loading) {
    return <div>Loading languages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Languages</h2>
      <ul>
        {languages.map((language) => (
          <li key={language.id}>
            {language.name} ({language.code})
            {language.flag && <span> {language.flag}</span>}
            <span> - {language.isActive ? 'Active' : 'Inactive'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}