using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using StudentFormAPI.Models;

namespace StudentFormAPI.Services
{
    public class QuestPdfService : IPdfService
    {
        public byte[] GeneratePdf(StudentForm form)
        {
            
            QuestPDF.Settings.License = LicenseType.Community;

            byte[] pdfBytes;
            using (var stream = new MemoryStream())
            {
                Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(2, Unit.Centimetre);
                        page.DefaultTextStyle(x => x.FontSize(12));

                        page.Header().Text("Fișa Studentului").SemiBold().FontSize(20);
                        
                        page.Content().PaddingVertical(1, Unit.Centimetre).Column(column =>
                        {
                            column.Item().Text($"Nume: {form.Nume}").FontSize(14);
                            column.Item().Text($"Prenume: {form.Prenume}").FontSize(14);
                            column.Item().Text($"Facultate: {form.Facultate}").FontSize(14);
                            column.Item().Height(20);
                            column.Item().Text("Motivație:").FontSize(14).SemiBold();
                            column.Item().Text(form.Motivatie).FontSize(12);
                            column.Item().Height(20);
                            column.Item().Text($"Data Submisiei: {form.DataSubmisiei:dd/MM/yyyy HH:mm}").FontSize(12);
                        });

                        page.Footer().AlignCenter().Text(x =>
                        {
                            x.Span("Pagina ");
                            x.CurrentPageNumber();
                            x.Span(" din ");
                            x.TotalPages();
                        });
                    });
                })
                .GeneratePdf(stream);

                pdfBytes = stream.ToArray();
            }

            return pdfBytes;
        }
    }
}