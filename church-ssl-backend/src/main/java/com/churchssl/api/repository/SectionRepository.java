package com.churchssl.api.repository;

import com.churchssl.api.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByLessonIdOrderByOrderAsc(Long lessonId);
}