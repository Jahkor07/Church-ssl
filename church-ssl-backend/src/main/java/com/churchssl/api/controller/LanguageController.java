package com.churchssl.api.controller;

import com.churchssl.api.dto.LanguageDto;
import com.churchssl.api.service.LanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/languages")
@CrossOrigin(origins = "*")
public class LanguageController {

    @Autowired
    private LanguageService languageService;

    @GetMapping
    public ResponseEntity<List<LanguageDto>> getAllActiveLanguages() {
        List<LanguageDto> languages = languageService.getAllActiveLanguages();
        return ResponseEntity.ok(languages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LanguageDto> getLanguageById(@PathVariable Long id) {
        LanguageDto language = languageService.getLanguageById(id);
        return ResponseEntity.ok(language);
    }

    @PostMapping
    public ResponseEntity<LanguageDto> createLanguage(@RequestBody LanguageDto languageDto) {
        LanguageDto createdLanguage = languageService.createLanguage(languageDto);
        return ResponseEntity.ok(createdLanguage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LanguageDto> updateLanguage(@PathVariable Long id, @RequestBody LanguageDto languageDto) {
        LanguageDto updatedLanguage = languageService.updateLanguage(id, languageDto);
        return ResponseEntity.ok(updatedLanguage);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLanguage(@PathVariable Long id) {
        languageService.deleteLanguage(id);
        return ResponseEntity.noContent().build();
    }
}