using System;
using System.Collections.Generic;
using System.Text;

namespace ProjectTaskManagement.Core.Common
{
    public class ApiErrorResponse
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; } = "";
        public List<string>? Errors { get; set; }

        public ApiErrorResponse(string message)
        {
            Message = message;
        }
    }
}
