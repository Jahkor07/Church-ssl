import { Lesson, Language, Section } from '@prisma/client';

// Format lesson data for API responses
export function formatLessonResponse(lesson: Lesson & { language: Language; sections: Section[] }) {
  return {
    lessonId: lesson.id,
    title: lesson.title,
    description: lesson.description,
    content: lesson.content,
    year: lesson.year,
    quarter: lesson.quarter,
    introduction: lesson.introduction,
    keywords: lesson.keywords,
    language: {
      languageId: lesson.languageId,
      languageName: lesson.language.name
    },
    isPublished: lesson.isPublished,
    order: lesson.order,
    sections: lesson.sections || []
  };
}