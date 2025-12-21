package com.churchssl.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SectionDto {
    private Long id;
    private String day;
    private String content;
    private String bibleTexts;
    private Integer order;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long lessonId;
}