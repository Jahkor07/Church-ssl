package com.churchssl.api.repository;

import com.churchssl.api.entity.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByYearAndQuarter(Integer year, String quarter);
    
    @Query("SELECT DISTINCT l.year FROM Lesson l ORDER BY l.year DESC")
    List<Integer> findDistinctYears();
    
    Page<Lesson> findByYear(Integer year, Pageable pageable);
    
    Page<Lesson> findByYearAndQuarter(Integer year, String quarter, Pageable pageable);
    
    @Query("SELECT l FROM Lesson l WHERE " +
           "(:year IS NULL OR l.year = :year) AND " +
           "(:quarter IS NULL OR l.quarter = :quarter) AND " +
           "(:languageId IS NULL OR l.language.id = :languageId)")
    Page<Lesson> findByFilters(@Param("year") Integer year, 
                              @Param("quarter") String quarter, 
                              @Param("languageId") Long languageId, 
                              Pageable pageable);
}