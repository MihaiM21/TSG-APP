namespace StudentFormAPI.Models
{
    public class StudentForm
    {
        public int Id { get; set; }
        public string Nume { get; set; } = string.Empty;
        public string Prenume { get; set; } = string.Empty;
        public string Facultate { get; set; } = string.Empty;
        public string Motivatie { get; set; } = string.Empty;
        public DateTime DataSubmisiei { get; set; }
    }
}