using Domain;
using FluentValidation;

namespace Application.Articles;

public class ArticleValidator : AbstractValidator<Article>
{
    public ArticleValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.CreatedAt).NotEmpty();
        RuleFor(x => x.Body).NotEmpty();
        RuleFor(x => x.Category).NotEmpty();
        RuleFor(x => x.AuthorId).NotEmpty();
    }
}