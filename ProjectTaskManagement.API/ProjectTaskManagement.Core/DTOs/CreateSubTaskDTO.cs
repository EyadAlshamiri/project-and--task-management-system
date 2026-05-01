using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Core.DTOs
{
    public class CreateSubTaskDTO
    {
        public string Title { get; set; } = null!;
        public bool IsCompleted { get; set; } = false;

        public string? AssignedTo { get; set; }

        public int TaskId { get; set; }
    }
}
