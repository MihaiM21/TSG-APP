using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentFormAPI.Data;
using StudentFormAPI.DTOs;
using StudentFormAPI.Models;
using StudentFormAPI.Services;

namespace StudentFormAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IPdfService _pdfService;
        private readonly ILogger<FormsController> _logger;

        public FormsController(
            ApplicationDbContext context,
            IMapper mapper,
            IPdfService pdfService,
            ILogger<FormsController> logger)
        {
            _context = context;
            _mapper = mapper;
            _pdfService = pdfService;
            _logger = logger;
        }

        // GET: api/Forms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentForm>>> GetForms()
        {
            return await _context.Table_Student.ToListAsync();
        }

        // GET: api/Forms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentForm>> GetForm(int id)
        {
            var form = await _context.Table_Student.FindAsync(id);

            if (form == null)
            {
                return NotFound();
            }

            return form;
        }

        // GET: api/Forms/5/pdf
        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> GetFormPdf(int id)
        {
            var form = await _context.Table_Student.FindAsync(id);

            if (form == null)
            {
                return NotFound();
            }

            try
            {
                var pdfBytes = _pdfService.GeneratePdf(form);
                return File(pdfBytes, "application/pdf", $"fisa-student-{form.Nume}-{form.Prenume}.pdf");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la generarea PDF-ului");
                return StatusCode(500, "Eroare la generarea PDF-ului");
            }
        }

        // POST: api/Forms
        [HttpPost]
        public async Task<ActionResult> SubmitForm([FromBody] StudentFormDto formDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Save the form in DB
                var form = _mapper.Map<StudentForm>(formDto);
                form.DataSubmisiei = DateTime.Now;
                _context.Table_Student.Add(form);
                await _context.SaveChangesAsync();

                // Generate the PDF file
                var pdfBytes = _pdfService.GeneratePdf(form);
                return File(pdfBytes, "application/pdf", $"fisa-student-{form.Nume}-{form.Prenume}.pdf");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la procesarea formularului");
                return StatusCode(500, "Eroare la procesarea formularului");
            }
        }

        // PUT: api/Forms/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutForm(int id, [FromBody] StudentFormDto formDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var form = await _context.Table_Student.FindAsync(id);
            if (form == null)
            {
                return NotFound();
            }

            // Update the form data
            form.Nume = formDto.Nume;
            form.Prenume = formDto.Prenume;
            form.Facultate = formDto.Facultate;
            form.Motivatie = formDto.Motivatie;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FormExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // DELETE: api/Forms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteForm(int id)
        {
            var form = await _context.Table_Student.FindAsync(id);
            if (form == null)
            {
                return NotFound();
            }

            _context.Table_Student.Remove(form);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Forms/test
        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "Backend API is working!" });
        }

        private bool FormExists(int id)
        {
            return _context.Table_Student.Any(e => e.Id == id);
        }
    }
}