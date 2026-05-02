using Microsoft.AspNetCore.Mvc;
using ProjectTaskManagement.Core.Common;
using ProjectTaskManagement.Core.DTOs;
using ProjectTaskManagement.Data.Entities;
using ProjectTaskManagement.Service;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _service;

    public ProjectsController(IProjectService service)
    {
        _service = service;
    }

    // GET
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var items = await _service.GetAllAsync();
        return Ok(new ApiResponse<List<ProjectDTO>>(items, "Projects retrieved successfully"));
    }

    // GET BY ID
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var p = await _service.GetByIdAsync(id);
        if (p == null) return NotFound(new ApiResponse<string>("", "Project not found"));

        var dto = new ProjectDTO
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            Status = p.Status,
            Priority = p.Priority,
            ProjectManagerName = p.ProjectManagerName,
            Members = string.IsNullOrEmpty(p.Members) ? new List<string>() : p.Members.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
            CreatedAt = p.CreatedAt,
            TasksCount = p.Tasks?.Count ?? 0,
            Progress = (p.Tasks != null && p.Tasks.Count > 0)
                ? (int)((double)p.Tasks.Count(t => t.Status.ToUpper() == "DONE") / p.Tasks.Count * 100)
                : 0,
            Tasks = p.Tasks?.Select(t => new ProjectTaskDTO
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                StartDate = t.StartDate,
                DueDate = t.DueDate,
                AssignedTo = t.AssignedTo,
                ProjectId = t.ProjectId,
                SubTasks = t.SubTasks?.Select(st => new SubTaskDTO()).ToList() ?? new List<SubTaskDTO>()
            }).ToList() ?? new List<ProjectTaskDTO>()
        };

        return Ok(new ApiResponse<ProjectDTO>(dto, "Project retrieved successfully"));
    }

    // POST
    [HttpPost]
    public async Task<IActionResult> Create(CreateProjectDto dto)
    {
        if (dto == null) return BadRequest(new ApiResponse<string>("", "Invalid project data"));
        if (string.IsNullOrWhiteSpace(dto.Title)) return BadRequest(new ApiResponse<string>("", "Title is required"));

        var project = new Project
        {
            Title = dto.Title,
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = dto.Status ?? string.Empty,
            Priority = dto.Priority ?? string.Empty,
            ProjectManagerName = dto.ProjectManagerName,
            Members = dto.Members != null ? string.Join(",", dto.Members) : null
        };

        var result = await _service.CreateAsync(project);
        return Ok(new ApiResponse<Project>(result, "Project created successfully"));
    }

    // PUT
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateProjectDto dto)
    {
        if (dto == null) return BadRequest(new ApiResponse<string>("", "Invalid project data"));
        if (string.IsNullOrWhiteSpace(dto.Title)) return BadRequest(new ApiResponse<string>("", "Title is required"));

        var project = new Project
        {
            Title = dto.Title,
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = dto.Status ?? string.Empty,
            Priority = dto.Priority ?? string.Empty,
            ProjectManagerName = dto.ProjectManagerName,
            Members = dto.Members != null ? string.Join(",", dto.Members) : null
        };

        var updated = await _service.UpdateAsync(id, project);
        if (!updated) return NotFound(new ApiResponse<string>("", "Project not found"));

        return Ok(new ApiResponse<bool>(true, "Project updated successfully"));
    }

    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound(new ApiResponse<string>("", "Project not found"));

        return Ok(new ApiResponse<bool>(true, "Project deleted successfully"));
    }
}