package com.churchssl.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SectionRequestDto {
    private String day;
    private String content;
    private String bibleTexts;
    private Integer order;
}