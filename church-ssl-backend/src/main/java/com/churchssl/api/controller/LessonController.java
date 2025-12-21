package com.churchssl.api.controller;

import com.churchssl.api.dto.LessonDto;
import com.churchssl.api.dto.LessonRequestDto;
import com.churchssl.api.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @GetMapping("/by-quarter")
    public ResponseEntity<List<LessonDto>> getLessonsByYearAndQuarter(
            @RequestParam Integer year,
            @RequestParam String quarter) {
        List<LessonDto> lessons = lessonService.getLessonsByYearAndQuarter(year, quarter);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/years")
    public ResponseEntity<List<Integer>> getAllYears() {
        List<Integer> years = lessonService.getAllYears();
        return ResponseEntity.ok(years);
    }

    @GetMapping
    public ResponseEntity<Page<LessonDto>> getLessonsWithFilters(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String quarter,
            @RequestParam(required = false) Long languageId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<LessonDto> lessons = lessonService.getLessonsWithFilters(year, quarter, languageId, page, size);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonDto> getLessonById(@PathVariable Long id) {
        LessonDto lesson = lessonService.getLessonById(id);
        return ResponseEntity.ok(lesson);
    }

    @PostMapping
    public ResponseEntity<LessonDto> createLesson(@RequestBody LessonRequestDto lessonRequestDto) {
        LessonDto createdLesson = lessonService.createLesson(lessonRequestDto);
        return ResponseEntity.ok(createdLesson);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonDto> updateLesson(@PathVariable Long id, @RequestBody LessonRequestDto lessonRequestDto) {
        LessonDto updatedLesson = lessonService.updateLesson(id, lessonRequestDto);
        return ResponseEntity.ok(updatedLesson);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}