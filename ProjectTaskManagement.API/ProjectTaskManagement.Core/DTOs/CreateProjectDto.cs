using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Core.DTOs
{
    public class CreateProjectDto
    {
        [System.Text.Json.Serialization.JsonPropertyName("tilte")]
        public string Title { get; set; } = null!;
        public string? Description { get; set; }


        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string Status { get; set; } = "NotStarted";
        public string Priority { get; set; } = "MEDIUM";
        public string? ProjectManagerName { get; set; }
        public List<string>? Members { get; set; }


    }
}
