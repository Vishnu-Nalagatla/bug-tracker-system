package com.example.bugtrackersystem.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bugtrackersystem.entity.Bug;
import com.example.bugtrackersystem.repository.BugRepository;

@Service
public class BugService {
    @Autowired
    BugRepository bugRepository;

    public List<Bug> getBugs(String role , String email) {
        if("admin".equalsIgnoreCase(role)) {
            return bugRepository.findAll();
        } else if ("projectManager".equalsIgnoreCase(role)) {
            return bugRepository.findByProjectManager(email);
        } else if ("developer".equalsIgnoreCase(role)) {
            return bugRepository.findByAssignee(email);
        } else {
            return bugRepository.findByCreatedBy(email);
        }
    }
}