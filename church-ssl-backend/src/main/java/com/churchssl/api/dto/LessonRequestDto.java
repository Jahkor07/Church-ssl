package com.churchssl.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonRequestDto {
    private String title;
    private String description;
    private String content;
    private String introduction;
    private Integer year;
    private String quarter;
    private String keywords;
    private Boolean isPublished;
    private Integer order;
    private Long languageId;
    private List<SectionRequestDto> sections;
}