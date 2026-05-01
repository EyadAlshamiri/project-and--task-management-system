using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Core.DTOs
{
    public class UpdateSubTaskDTO
    {
        public string Title { get; set; } = null!;
        public bool IsCompleted { get; set; }

        public string? AssignedTo { get; set; }
    }
}
