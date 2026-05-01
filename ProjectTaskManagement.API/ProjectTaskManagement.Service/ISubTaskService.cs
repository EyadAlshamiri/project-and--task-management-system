using ProjectTaskManagement.Core.DTOs;
using ProjectTaskManagement.Data.Entities;
using ProjectTaskManagement.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Service
{
    public interface ISubTaskService
    {
        Task<SubTaskDTO> CreateAsync(CreateSubTaskDTO dto);

        Task<List<SubTaskDTO>> GetAllAsync();
        Task<SubTaskDTO?> GetByIdAsync(int id);

        Task<bool> UpdateAsync(int id, UpdateSubTaskDTO dto);
        Task<bool> DeleteAsync(int id);
    }
    public class SubTaskService : ISubTaskService
    {
        private readonly ApplicationDBContext _context;

        public SubTaskService(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<SubTaskDTO> CreateAsync(CreateSubTaskDTO dto)
        {
            var subTask = new SubTask
            {
                Title = dto.Title,
                IsCompleted = dto.IsCompleted,
                AssignedTo = dto.AssignedTo,
                TaskId = dto.TaskId
            };

            _context.SubTasks.Add(subTask);
            await _context.SaveChangesAsync();

            return MapToDTO(subTask);
        }

        public async Task<List<SubTaskDTO>> GetAllAsync()
        {
            var subTasks = await _context.SubTasks.ToListAsync();
            return subTasks.Select(MapToDTO).ToList();
        }

        public async Task<SubTaskDTO?> GetByIdAsync(int id)
        {
            var subTask = await _context.SubTasks.FindAsync(id);
            return subTask == null ? null : MapToDTO(subTask);
        }

        public async Task<bool> UpdateAsync(int id, UpdateSubTaskDTO dto)
        {
            var subTask = await _context.SubTasks.FindAsync(id);
            if (subTask == null) return false;

            subTask.Title = dto.Title;
            subTask.IsCompleted = dto.IsCompleted;
            subTask.AssignedTo = dto.AssignedTo;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var subTask = await _context.SubTasks.FindAsync(id);
            if (subTask == null) return false;

            _context.SubTasks.Remove(subTask);
            await _context.SaveChangesAsync();
            return true;
        }

        // Mapping
        private SubTaskDTO MapToDTO(SubTask subTask)
        {
            return new SubTaskDTO
            {
                Id = subTask.Id,
                Title = subTask.Title,
                IsCompleted = subTask.IsCompleted,
                AssignedTo = subTask.AssignedTo,
                TaskId = subTask.TaskId
            };
        }
    }
}
