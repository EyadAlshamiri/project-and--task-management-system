using Microsoft.EntityFrameworkCore;
using ProjectTaskManagement.Core.DTOs;
using ProjectTaskManagement.Data.Entities;
using ProjectTaskManagement.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Service
{
    public interface IProjectService
    {
        Task<List<ProjectDTO>> GetAllAsync();
        Task<Project?> GetByIdAsync(int id);
        Task<Project> CreateAsync(Project project);
        Task<bool> UpdateAsync(int id, Project project);
        Task<bool> DeleteAsync(int id);
    }
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDBContext _context;

        public ProjectService(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<ProjectDTO>> GetAllAsync()
        {
            return await _context.Projects
                .Select(p => new ProjectDTO
                {
                    Id = p.Id,
                    Tilte = p.Title,
                    Description = p.Description,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    Status = p.Status,
                    Priority = p.Priority,
                    ProjectManagerName = p.ProjectManagerName,
                    Members = string.IsNullOrEmpty(p.Members) ? new List<string>() : p.Members.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
                    CreatedAt = p.CreatedAt,

                    TasksCount = p.Tasks.Count(),
                    Progress = p.Tasks.Count > 0 
                        ? (int)((double)p.Tasks.Count(t => t.Status == "DONE") / p.Tasks.Count * 100) 
                        : 0
                })
                .ToListAsync();
        }

        public async Task<Project?> GetByIdAsync(int id)
        {
            return await _context.Projects
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Project> CreateAsync(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return project;
        }

        public async Task<bool> UpdateAsync(int id, Project project)
        {
            var existing = await _context.Projects.FindAsync(id);
            if (existing == null) return false;

            existing.Title = project.Title;
            existing.Description = project.Description;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
