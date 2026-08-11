package com.cg.smms.repository;

import com.cg.smms.entities.Mall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MallRepository extends JpaRepository<Mall, Long> {
}