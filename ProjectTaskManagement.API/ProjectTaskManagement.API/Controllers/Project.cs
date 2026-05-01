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
    public async Task<IActionResult> GetAll()
    {
        var data = await _service.GetAllAsync();
        return Ok(new ApiResponse<List<ProjectDTO>>(data, "Projects retrieved successfully"));
    }

    // GET BY ID
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await _service.GetByIdAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    // POST
    [HttpPost]
    public async Task<IActionResult> Create(CreateProjectDto dto)
    {
        var project = new Project
        {
            Title = dto.Title,
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = dto.Status
        };

        var result = await _service.CreateAsync(project);
        return Ok(result);
    }

    // PUT
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateProjectDto dto)
    {
        var project = new Project
        {
            Title = dto.Title,
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = dto.Status
        };

        var updated = await _service.UpdateAsync(id, project);
        if (!updated) return NotFound();

        return NoContent();
    }

    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound();

        return NoContent();
    }
}