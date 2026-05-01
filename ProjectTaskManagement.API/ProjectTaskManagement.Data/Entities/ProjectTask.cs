using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Data.Entities
{
    public class ProjectTask
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        public string? Description { get; set; }

        public string Status { get; set; } = "Pending";
        public int Priority { get; set; } = 2;

        public DateTime StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        public string? AssignedTo { get; set; }

        public int ProjectId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // العلاقات
        public Project Project { get; set; } = null!;
        public List<SubTask> SubTasks { get; set; } = new();
    }
}
