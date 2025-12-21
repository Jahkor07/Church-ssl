package com.churchssl.api.service;

import com.churchssl.api.dto.LanguageDto;
import com.churchssl.api.entity.Language;
import com.churchssl.api.repository.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LanguageService {

    @Autowired
    private LanguageRepository languageRepository;

    public List<LanguageDto> getAllActiveLanguages() {
        return languageRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public LanguageDto getLanguageById(Long id) {
        Language language = languageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Language not found with id: " + id));
        return convertToDto(language);
    }

    public LanguageDto createLanguage(LanguageDto languageDto) {
        Language language = convertToEntity(languageDto);
        Language savedLanguage = languageRepository.save(language);
        return convertToDto(savedLanguage);
    }

    public LanguageDto updateLanguage(Long id, LanguageDto languageDto) {
        Language existingLanguage = languageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Language not found with id: " + id));
        
        existingLanguage.setName(languageDto.getName());
        existingLanguage.setCode(languageDto.getCode());
        existingLanguage.setFlag(languageDto.getFlag());
        existingLanguage.setIsActive(languageDto.getIsActive());
        
        Language updatedLanguage = languageRepository.save(existingLanguage);
        return convertToDto(updatedLanguage);
    }

    public void deleteLanguage(Long id) {
        Language language = languageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Language not found with id: " + id));
        languageRepository.delete(language);
    }

    private LanguageDto convertToDto(Language language) {
        LanguageDto dto = new LanguageDto();
        dto.setId(language.getId());
        dto.setName(language.getName());
        dto.setCode(language.getCode());
        dto.setFlag(language.getFlag());
        dto.setIsActive(language.getIsActive());
        dto.setCreatedAt(language.getCreatedAt());
        dto.setUpdatedAt(language.getUpdatedAt());
        return dto;
    }

    private Language convertToEntity(LanguageDto dto) {
        Language language = new Language();
        language.setName(dto.getName());
        language.setCode(dto.getCode());
        language.setFlag(dto.getFlag());
        language.setIsActive(dto.getIsActive());
        return language;
    }
}