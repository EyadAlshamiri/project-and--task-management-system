using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Core.DTOs
{
    public class CreateProjectDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }


        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string Status { get; set; } = "NotStarted";


    }
}
