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
                        x.AuthoredArticles.Sum(y => y.Likes.Count)))
                .ForMember(x => x.Image,
                    o => o.MapFrom(x =>
                        x.Photo.Url));
            CreateMap<Article, ArticleDto>()
                .ForMember(d => d.Category,
                    o =>
                        o.MapFrom(s => s.Category))
                .ForMember(d => d.Likes,
                    o =>
                        o.MapFrom(s => s.Likes))
                .ForMember(d => d.Author,
                    o =>
                        o.MapFrom(s => s.Author))
                .ForMember(d => d.Image,
                    o => 
                        o.MapFrom(x => x.Photo.Url));
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.Username,
                    o => 
                        o.MapFrom(x => x.Author.UserName))
                .ForMember(d => d.DisplayName,
                    o => 
                        o.MapFrom(x => x.Author.DisplayName));
            CreateMap<Category, CategoryDto>();
        }
    }
}