using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Core.DTOs
{
    public class ProjectDTO
    {
        public int Id { get; set; }
        public string Tilte { get; set; } = null!;
        public string? Description { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string? Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        public int TasksCount { get; set; }
    }
}
