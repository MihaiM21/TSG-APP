using Microsoft.EntityFrameworkCore;
using StudentFormAPI.Models;

namespace StudentFormAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<StudentForm> Table_Student { get; set; } = null!;
    }
}