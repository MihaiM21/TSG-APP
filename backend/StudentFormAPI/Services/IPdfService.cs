using StudentFormAPI.Models;

namespace StudentFormAPI.Services
{
    public interface IPdfService
    {
        byte[] GeneratePdf(StudentForm form);
    }
}