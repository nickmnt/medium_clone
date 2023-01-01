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
            CreateMap<AppUser, ProfileDto>()
                .ForMember(x => x.LikedCount,
                    o => o.MapFrom(x => 
                        x.AuthoredArticles.Sum(y => y.Likes.Count)));
            CreateMap<Article, ArticleDto>()
                .ForMember(d => d.Category,
                    o => 
                        o.MapFrom(s => s.Category))
                .ForMember(d => d.Likes,
                    o =>
                        o.MapFrom(s => s.Likes));
            CreateMap<Comment, CommentDto>();
            CreateMap<Category, CategoryDto>();
        }
    }
}