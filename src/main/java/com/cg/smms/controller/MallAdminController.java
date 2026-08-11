package com.cg.smms.controller;

import com.cg.smms.entities.MallAdmin;
import com.cg.smms.service.MallAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mall-admins")
public class MallAdminController {

    @Autowired
    private MallAdminService mallAdminService;

    @PostMapping
    public ResponseEntity<MallAdmin> addMallAdmin(@RequestBody MallAdmin mallAdmin) {
        return ResponseEntity.ok(mallAdminService.addMallAdmin(mallAdmin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MallAdmin> updateMallAdmin(@PathVariable Long id, @RequestBody MallAdmin mallAdmin) {
        mallAdmin.setId(id);
        return ResponseEntity.ok(mallAdminService.updateMallAdmin(mallAdmin));
    }

    @PostMapping("/login")
    public ResponseEntity<MallAdmin> login(@RequestParam String name, @RequestParam String password) {
        MallAdmin admin = mallAdminService.login(name, password);
        return admin != null ? ResponseEntity.ok(admin) : ResponseEntity.status(401).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MallAdmin> getMallAdmin(@PathVariable Long id) {
        MallAdmin admin = mallAdminService.getMallAdmin(id);
        return admin != null ? ResponseEntity.ok(admin) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMallAdmin(@PathVariable Long id) {
        mallAdminService.deleteMallAdmin(id);
        return ResponseEntity.ok().build();
    }
}