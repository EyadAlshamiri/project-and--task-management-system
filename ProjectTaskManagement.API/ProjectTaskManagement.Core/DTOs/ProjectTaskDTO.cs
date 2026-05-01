using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Core.DTOs
{
    public class ProjectTaskDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }

        public string Status { get; set; } = null!;
        public int Priority { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        public string? AssignedTo { get; set; }
        public int ProjectId { get; set; }

        public List<SubTaskDTO> SubTasks { get; set; } = new();
    }
}
