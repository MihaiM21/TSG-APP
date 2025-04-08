using AutoMapper;
using StudentFormAPI.DTOs;
using StudentFormAPI.Models;

namespace StudentFormAPI.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<StudentFormDto, StudentForm>();
        }
    }
}