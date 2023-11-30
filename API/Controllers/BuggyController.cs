using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        [HttpGet("not-found")]
        public ActionResult GetNotFound()
        {
            return NotFound();
        }

        [HttpGet("bad-request")]
        public ActionResult GetBadFound()
        {
            return BadRequest(new ProblemDetails
            {
                Title="This is a bad request",
                Status=400,
                Detail="This is a bad request"
            });
        }
        
        [HttpGet("unauthorized")]
        public ActionResult GetUnauthorised()
        {
            return Unauthorized();
        }

        [HttpPost("validation-error")]
        public ActionResult GetValidationError()
        {
            ModelState.AddModelError("key", "This is a model error");
            ModelState.AddModelError("another key", "This is another model error");

            return ValidationProblem();
        }

        [HttpGet("server-error")]
        public ActionResult GetServerError()
        {
            throw new Exception("This is a server error");
        }
    }
}