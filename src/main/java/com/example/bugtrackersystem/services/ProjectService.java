package com.example.bugtrackersystem.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bugtrackersystem.entity.Project;
import com.example.bugtrackersystem.repository.ProjectRepository;

@Service
public class ProjectService {

    @Autowired
    ProjectRepository projectRepository;

    public void createProject(String name, String description, String projectManager, List<String> users) {
        Project project = new Project();
        project.setName(name);
        project.setProjectManager(projectManager);
        project.setDescription(description);
        List<String> bugList = new ArrayList<>();
        bugList.add("Frontend");
        bugList.add("Backend");
        project.setBugTypes(bugList);
        project.setUsers(users);
        projectRepository.save(project);
    }

    public List<Project> getProjects(String email , String role) {
        List<Project> projectList = new ArrayList<>();
        if ( "admin".equalsIgnoreCase(role)) {
           projectList = projectRepository.findAll();
        } else if ("productManager".equalsIgnoreCase(role)) {
            projectList = projectRepository.findByProjectManager(email);
        } else {
            projectList = projectRepository.findByUsers(email);
        }
        return projectList;
    }

    public void updateProject(String projectName , String projectDescription , String productManager,
                              List<String> users) {
        Project project = projectRepository.findByName(projectName);
        project.setDescription(projectDescription);
        project.setUsers(users);
        project.setProjectManager(productManager);
        projectRepository.save(project);
    }
}