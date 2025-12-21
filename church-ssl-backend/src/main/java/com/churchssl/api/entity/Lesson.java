package com.churchssl.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {
    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(nullable = false)
private String title;

@Column(length = 1000)
private String description;

@Column(length = 5000, nullable = false)
private String content;

@Column(length = 2000)
private String introduction;

@Column(nullable = false)
private Integer year;

@Column(nullable = false)
private String quarter;

@Column(length = 500)
private String keywords;

@Column(name = "is_published")
private Boolean isPublished = false;

@Column(name = "lesson_order")
private Integer order = 0;

@Column(name = "created_at")
private LocalDateTime createdAt = LocalDateTime.now();

@Column(name = "updated_at")
private LocalDateTime updatedAt = LocalDateTime.now();

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "language_id", nullable = false)
private Language language;

@OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<Section> sections;

@PreUpdate
public void preUpdate() {
this.updatedAt = LocalDateTime.now();
}
}