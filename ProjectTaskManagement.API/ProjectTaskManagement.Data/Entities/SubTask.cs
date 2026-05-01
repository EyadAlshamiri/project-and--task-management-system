using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Data.Entities
{
    public class SubTask
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        public bool IsCompleted { get; set; } = false;

        public string? AssignedTo { get; set; }

        public int TaskId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // العلاقة
        public ProjectTask Task { get; set; } = null!;
    }
}
