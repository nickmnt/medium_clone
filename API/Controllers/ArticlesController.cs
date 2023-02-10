using API.DTOs;
using Application.Articles;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ArticlesController : BaseApiController
{
    /// <summary>
    /// Returns the list of all articles.
    /// </summary>
    /// <param name="category">When available, only articles of this category will be returned</param>
    /// <param name="orderByDate">Should the articles be ordered by date? (descending)</param>
    /// <param name="orderByLikes">Should the articles be ordered by # of likes? (descending)</param>
    /// <returns></returns>
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<ArticleDto>>> GetArticles(string category, bool orderByDate, bool orderByLikes)
    {
        var result = await Mediator.Send(new List.Query
        {
            Category = category,
            OrderByDate = orderByDate,
            OrderByLikes = orderByLikes 
        });
        return HandleResult(result);
    }
    
    /// <summary>
    /// Returns the list of articles that satisfy the search query. (OR operator is used with the conditions)
    /// </summary>
    /// <param name="bodySubstring">Articles should include this substring in their body. (optional)</param>
    /// <param name="titleSubstring">Articles should include this substring in their title. (optional)</param>
    /// <param name="authorNameSubstring">Articles should include this substring in their author's name (optional)</param>
    /// <returns></returns>
    [AllowAnonymous]
    [HttpGet("search")]
    public async Task<ActionResult<List<ArticleDto>>> SearchArticles(string bodySubstring, string titleSubstring,
        string authorNameSubstring)
    {
        var result = await Mediator.Send(new Search.Query
        {
            BodySubstring = bodySubstring,
            TitleSubstring = titleSubstring,
            AuthorNameSubstring = authorNameSubstring 
        });
        return HandleResult(result);
    }
    
    /// <summary>
    /// Create a new article.
    /// </summary>
    /// <param name="command">The command.</param>
    /// <returns></returns>
    [HttpPost]
    public async Task<ActionResult<Unit>> Create(Create.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
    
    /// <summary>
    /// Update the article. (Must be owner)
    /// </summary>
    /// <param name="dto">Contains the data of the updated article.</param>
    /// <param name="articleId">Id of the article being updated.</param>
    /// <returns></returns>
    [Authorize(Policy = "IsArticleOwner")]
    [HttpPut]
    public async Task<ActionResult<Unit>> Update(UpdateArticleDto dto, int articleId)
    {
        var result = await Mediator.Send(new Update.Command {
            ArticleId = articleId,
            Title = dto.Title,
            Body = dto.Body,
            CategoryId = dto.CategoryId
        });
        return HandleResult(result);
    }
    
    /// <summary>
    /// Add/Remove (Toggle) the article to the list of articles liked by the current user.
    /// </summary>
    /// <param name="command">The command.</param>
    /// <returns></returns>
    [HttpPut("like")]
    public async Task<ActionResult<Unit>> Like(Like.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
    
    /// <summary>
    /// Add/Remove (Toggle) the article to the list of articles liked by the current user.
    /// </summary>
    /// <param name="command">The command.</param>
    /// <returns></returns>
    [HttpPut("save")]
    public async Task<ActionResult<Unit>> Save(Save.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
    
    /// <summary>
    /// Change the isApproved property of an article. (Must be admin)
    /// </summary>
    /// <param name="command">The command</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpPut("approve")]
    public async Task<ActionResult<Unit>> ToggleIsApproved(Approve.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
    
    /// <summary>
    /// Delete the article. (Must be owner)
    /// </summary>
    /// <param name="articleId">Id of the article being deleted.</param>
    /// <returns></returns>
    [Authorize(Policy = "IsArticleOwner")]
    [HttpDelete]
    public async Task<ActionResult<Unit>> Update(int articleId)
    {
        var result = await Mediator.Send(new Delete.Command {
            ArticleId = articleId
        });
        return HandleResult(result);
    }
    
    /// <summary>
    /// Delete the article. (Must be admin)
    /// </summary>
    /// <param name="articleId">Id of the article being deleted.</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpDelete("admin-delete")]
    public async Task<ActionResult<Unit>> AdminDelete(int articleId)
    {
        var result = await Mediator.Send(new Delete.Command {
            ArticleId = articleId
        });
        return HandleResult(result);
    }
}