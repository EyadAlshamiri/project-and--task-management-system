using ProjectTaskManagement.Core.DTOs;
using ProjectTaskManagement.Data.Entities;
using ProjectTaskManagement.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace ProjectTaskManagement.Service
{
    public interface IProjectTaskService
    {
        Task<ProjectTaskDTO> CreateAsync(CreateProjectTaskDTO dto);
        Task<List<ProjectTaskDTO>> GetAllAsync();
        Task<ProjectTaskDTO?> GetByIdAsync(int id);

        Task<bool> UpdateAsync(int id, UpdateProjectTaskDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<List<ProjectTaskDTO>> GetByProjectIdAsync(int projectId);
    }
    public class ProjectTaskService : IProjectTaskService
    {
        private readonly ApplicationDBContext _context;

        public ProjectTaskService(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<ProjectTaskDTO> CreateAsync(CreateProjectTaskDTO dto)
        {
            var task = new ProjectTask
            {
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                Priority = dto.Priority,
                StartDate = dto.StartDate,
                DueDate = dto.DueDate,
                AssignedTo = dto.AssignedTo,
                ProjectId = dto.ProjectId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return MapToDTO(task);
        }

        public async Task<List<ProjectTaskDTO>> GetAllAsync()
        {
            var tasks = await _context.Tasks.Include(t => t.SubTasks).ToListAsync();
            return tasks.Select(MapToDTO).ToList();
        }

        public async Task<List<ProjectTaskDTO>> GetByProjectIdAsync(int projectId)
        {
            var tasks = await _context.Tasks
                .Include(t => t.SubTasks)
                .Where(t => t.ProjectId == projectId)
                .ToListAsync();
            return tasks.Select(MapToDTO).ToList();
        }

        public async Task<ProjectTaskDTO?> GetByIdAsync(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.SubTasks)
                .FirstOrDefaultAsync(t => t.Id == id);

            return task == null ? null : MapToDTO(task);
        }

        public async Task<bool> UpdateAsync(int id, UpdateProjectTaskDTO dto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Status = dto.Status;
            task.Priority = dto.Priority;
            task.StartDate = dto.StartDate;
            task.DueDate = dto.DueDate;
            task.AssignedTo = dto.AssignedTo;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        // Helper Mapping
        private ProjectTaskDTO MapToDTO(ProjectTask task)
        {
            return new ProjectTaskDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                StartDate = task.StartDate,
                DueDate = task.DueDate,
                AssignedTo = task.AssignedTo,
                ProjectId = task.ProjectId,
                SubTasks = task.SubTasks.Select(s => new SubTaskDTO
                {
                    Id = s.Id,
                    Title = s.Title,
                    IsCompleted = s.IsCompleted,
                    AssignedTo = s.AssignedTo,
                    TaskId = s.TaskId
                }).ToList()
            };
        }
    }

}
