using Microsoft.AspNetCore.Mvc;
using ProjectTaskManagement.Core.Common;
using ProjectTaskManagement.Core.DTOs;
using ProjectTaskManagement.Service;

[ApiController]
[Route("api/[controller]")]
public class SubTasksController : ControllerBase
{
    private readonly ISubTaskService _service;

    public SubTasksController(ISubTaskService service)
    {
        _service = service;
    }

    // CREATE
    [HttpPost]
    public async Task<IActionResult> Create(CreateSubTaskDTO dto)
    {
        var result = await _service.CreateAsync(dto);
        return Ok(new ApiResponse<SubTaskDTO>(result, "SubTask created successfully"));
    }

    // GET ALL
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(new ApiResponse<List<SubTaskDTO>>(result, "SubTasks retrieved successfully"));
    }

    // GET BY ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound(new ApiResponse<string>("", "SubTask not found"));

        return Ok(new ApiResponse<SubTaskDTO>(result, "SubTask retrieved successfully"));
    }

    // UPDATE
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateSubTaskDTO dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (!updated) return NotFound(new ApiResponse<string>("", "SubTask not found"));

        return Ok(new ApiResponse<bool>(true, "SubTask updated successfully"));
    }

    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound(new ApiResponse<string>("", "SubTask not found"));

        return Ok(new ApiResponse<bool>(true, "SubTask deleted successfully"));
    }
}