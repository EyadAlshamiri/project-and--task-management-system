using Microsoft.AspNetCore.Mvc;
using ProjectTaskManagement.Core.Common;
using ProjectTaskManagement.Core.DTOs;
using ProjectTaskManagement.Service;

[ApiController]
[Route("api/[controller]")]
public class ProjectTasksController : ControllerBase
{
    private readonly IProjectTaskService _service;

    public ProjectTasksController(IProjectTaskService service)
    {
        _service = service;
    }

    // CREATE
    [HttpPost]
    public async Task<IActionResult> Create(CreateProjectTaskDTO dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(new ApiResponse<ProjectTaskDTO>(result, "Task created successfully"));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tasks = await _service.GetAllAsync();
        return Ok(new ApiResponse<List<ProjectTaskDTO>>(tasks, "Tasks retrieved successfully"));
    }

    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        var tasks = await _service.GetByProjectIdAsync(projectId);
        return Ok(new ApiResponse<List<ProjectTaskDTO>>(tasks, "Project tasks retrieved successfully"));
    }

    // GET BY ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _service.GetByIdAsync(id);
        if (task == null) return NotFound(new ApiResponse<string>("", "Task not found"));

        return Ok(new ApiResponse<ProjectTaskDTO>(task, "Task retrieved successfully"));
    }

    // UPDATE
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateProjectTaskDTO dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (!updated) return NotFound(new ApiResponse<string>("", "Task not found"));

        return Ok(new ApiResponse<bool>(true, "Task updated successfully"));
    }

    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound(new ApiResponse<string>("", "Task not found"));

        return Ok(new ApiResponse<bool>(true, "Task deleted successfully"));
    }

}