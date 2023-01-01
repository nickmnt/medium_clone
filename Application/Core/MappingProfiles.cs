using System;
using System.Linq;
using Application.AppUsers;
using Application.Articles;
using Application.Categories;
using Application.Comments;
using Domain;
using Profile = AutoMapper.Profile;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Article, ArticleDto>()
                .ForMember(d => d.Category,
                    o => 
                        o.MapFrom(s => s.Category));
            CreateMap<AppUser, ProfileDto>();
            CreateMap<Comment, CommentDto>();
            CreateMap<Category, CategoryDto>();
        }
    }
}