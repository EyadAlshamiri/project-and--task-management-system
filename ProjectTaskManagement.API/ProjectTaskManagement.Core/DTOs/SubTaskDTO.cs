using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Core.DTOs
{
    public class SubTaskDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public bool IsCompleted { get; set; }

        public string? AssignedTo { get; set; }

        public int TaskId { get; set; }
    }
}
