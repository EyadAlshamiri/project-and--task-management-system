using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Core.DTOs
{
    public class UpdateProjectTaskDTO
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }

        public string Status { get; set; } = "Pending";
        public int Priority { get; set; } = 2;

        public DateTime StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        public string? AssignedTo { get; set; }
        public List<SubTaskDTO> SubTasks { get; set; } = new();
    }
}
