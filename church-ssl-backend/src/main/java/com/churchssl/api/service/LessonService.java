package com.churchssl.api.service;

import com.churchssl.api.dto.*;
import com.churchssl.api.entity.Language;
import com.churchssl.api.entity.Lesson;
import com.churchssl.api.entity.Section;
import com.churchssl.api.repository.LanguageRepository;
import com.churchssl.api.repository.LessonRepository;
import com.churchssl.api.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private LanguageRepository languageRepository;

    @Autowired
    private SectionRepository sectionRepository;

    public List<LessonDto> getLessonsByYearAndQuarter(Integer year, String quarter) {
        return lessonRepository.findByYearAndQuarter(year, quarter)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<Integer> getAllYears() {
        return lessonRepository.findDistinctYears();
    }

    public Page<LessonDto> getLessonsWithFilters(Integer year, String quarter, Long languageId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Lesson> lessons = lessonRepository.findByFilters(year, quarter, languageId, pageable);
        return lessons.map(this::convertToDto);
    }

    public LessonDto getLessonById(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
        return convertToDto(lesson);
    }

    public LessonDto createLesson(LessonRequestDto lessonRequestDto) {
        Lesson lesson = new Lesson();
        lesson.setTitle(lessonRequestDto.getTitle());
        lesson.setDescription(lessonRequestDto.getDescription());
        lesson.setContent(lessonRequestDto.getContent());
        lesson.setIntroduction(lessonRequestDto.getIntroduction());
        lesson.setYear(lessonRequestDto.getYear());
        lesson.setQuarter(lessonRequestDto.getQuarter());
        lesson.setKeywords(lessonRequestDto.getKeywords());
        lesson.setIsPublished(lessonRequestDto.getIsPublished());
        lesson.setOrder(lessonRequestDto.getOrder());

        // Set language
        Language language = languageRepository.findById(lessonRequestDto.getLanguageId())
                .orElseThrow(() -> new RuntimeException("Language not found with id: " + lessonRequestDto.getLanguageId()));
        lesson.setLanguage(language);

        Lesson savedLesson = lessonRepository.save(lesson);

        // Save sections if provided
        if (lessonRequestDto.getSections() != null) {
            for (SectionRequestDto sectionDto : lessonRequestDto.getSections()) {
                Section section = new Section();
                section.setDay(sectionDto.getDay());
                section.setContent(sectionDto.getContent());
                section.setBibleTexts(sectionDto.getBibleTexts());
                section.setOrder(sectionDto.getOrder());
                section.setLesson(savedLesson);
                sectionRepository.save(section);
            }
        }

        return convertToDto(savedLesson);
    }

    public LessonDto updateLesson(Long id, LessonRequestDto lessonRequestDto) {
        Lesson existingLesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

        existingLesson.setTitle(lessonRequestDto.getTitle());
        existingLesson.setDescription(lessonRequestDto.getDescription());
        existingLesson.setContent(lessonRequestDto.getContent());
        existingLesson.setIntroduction(lessonRequestDto.getIntroduction());
        existingLesson.setYear(lessonRequestDto.getYear());
        existingLesson.setQuarter(lessonRequestDto.getQuarter());
        existingLesson.setKeywords(lessonRequestDto.getKeywords());
        existingLesson.setIsPublished(lessonRequestDto.getIsPublished());
        existingLesson.setOrder(lessonRequestDto.getOrder());

        // Update language if provided
        if (lessonRequestDto.getLanguageId() != null) {
            Language language = languageRepository.findById(lessonRequestDto.getLanguageId())
                    .orElseThrow(() -> new RuntimeException("Language not found with id: " + lessonRequestDto.getLanguageId()));
            existingLesson.setLanguage(language);
        }

        Lesson updatedLesson = lessonRepository.save(existingLesson);

        // Update sections if provided
        if (lessonRequestDto.getSections() != null) {
            // Delete existing sections
            sectionRepository.deleteAll(sectionRepository.findByLessonIdOrderByOrderAsc(id));
            
            // Add new sections
            for (SectionRequestDto sectionDto : lessonRequestDto.getSections()) {
                Section section = new Section();
                section.setDay(sectionDto.getDay());
                section.setContent(sectionDto.getContent());
                section.setBibleTexts(sectionDto.getBibleTexts());
                section.setOrder(sectionDto.getOrder());
                section.setLesson(updatedLesson);
                sectionRepository.save(section);
            }
        }

        return convertToDto(updatedLesson);
    }

    public void deleteLesson(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
        lessonRepository.delete(lesson);
    }

    private LessonDto convertToDto(Lesson lesson) {
        LessonDto dto = new LessonDto();
        dto.setId(lesson.getId());
        dto.setTitle(lesson.getTitle());
        dto.setDescription(lesson.getDescription());
        dto.setContent(lesson.getContent());
        dto.setIntroduction(lesson.getIntroduction());
        dto.setYear(lesson.getYear());
        dto.setQuarter(lesson.getQuarter());
        dto.setKeywords(lesson.getKeywords());
        dto.setIsPublished(lesson.getIsPublished());
        dto.setOrder(lesson.getOrder());
        dto.setCreatedAt(lesson.getCreatedAt());
        dto.setUpdatedAt(lesson.getUpdatedAt());

        // Set language
        if (lesson.getLanguage() != null) {
            LanguageDto languageDto = new LanguageDto();
            languageDto.setId(lesson.getLanguage().getId());
            languageDto.setName(lesson.getLanguage().getName());
            languageDto.setCode(lesson.getLanguage().getCode());
            languageDto.setFlag(lesson.getLanguage().getFlag());
            languageDto.setIsActive(lesson.getLanguage().getIsActive());
            languageDto.setCreatedAt(lesson.getLanguage().getCreatedAt());
            languageDto.setUpdatedAt(lesson.getLanguage().getUpdatedAt());
            dto.setLanguage(languageDto);
        }

        // Set sections
        if (lesson.getSections() != null) {
            List<SectionDto> sectionDtos = lesson.getSections()
                    .stream()
                    .map(this::convertSectionToDto)
                    .collect(Collectors.toList());
            dto.setSections(sectionDtos);
        }

        return dto;
    }

    private SectionDto convertSectionToDto(Section section) {
        SectionDto dto = new SectionDto();
        dto.setId(section.getId());
        dto.setDay(section.getDay());
        dto.setContent(section.getContent());
        dto.setBibleTexts(section.getBibleTexts());
        dto.setOrder(section.getOrder());
        dto.setCreatedAt(section.getCreatedAt());
        dto.setUpdatedAt(section.getUpdatedAt());
        dto.setLessonId(section.getLesson().getId());
        return dto;
    }
}