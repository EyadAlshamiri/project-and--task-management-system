using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Data.Entities
{
    public class Project
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        public string? Description { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string Status { get; set; } = "NotStarted";
        public string Priority { get; set; } = "MEDIUM";
        public string? ProjectManagerName { get; set; }
        public string? Members { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // العلاقة
        public List<ProjectTask> Tasks { get; set; } = new();


    }
}
