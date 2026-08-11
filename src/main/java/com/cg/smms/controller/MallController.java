package com.cg.smms.controller;

import com.cg.smms.entities.Mall;
import com.cg.smms.service.MallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/malls")
public class MallController {

    @Autowired
    private MallService mallService;

    @PostMapping
    public ResponseEntity<Mall> addMall(@RequestBody Mall mall) {
        return ResponseEntity.ok(mallService.addMall(mall));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mall> updateMall(@PathVariable Long id, @RequestBody Mall mall) {
        mall.setId(id);
        return ResponseEntity.ok(mallService.updateMall(mall));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mall> getMall(@PathVariable Long id) {
        Mall mall = mallService.getMall(id);
        return mall != null ? ResponseEntity.ok(mall) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Mall>> getAllMalls() {
        return ResponseEntity.ok(mallService.getAllMalls());
    }
}