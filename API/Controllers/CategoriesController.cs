using Application.Categories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Create = Application.Comments.Create;

namespace API.Controllers;

public class CategoriesController : BaseApiController
{
    /// <summary>
    /// Returns the list of all categories.
    /// </summary>
    /// <param name="orderByArticleCount">Should categories by ordered by the # of articles? (descending)</param>
    /// <returns></returns>
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories(bool orderByArticleCount)
    {
        var result = await Mediator.Send(new List.Query
        {
            OrderByArticleCount = orderByArticleCount
        });
        return HandleResult(result);
    }
    
    /// <summary>
    /// Creates a new category. (Must be admin)
    /// </summary>
    /// <param name="command">The command.</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Unit>> Create(Create.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
    
    /// <summary>
    /// Updates an existing category. (Must be admin)
    /// </summary>
    /// <param name="command">The command.</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult<Unit>> Update(Update.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
    
    /// <summary>
    /// Deletes a category. (Must be admin)
    /// </summary>
    /// <param name="command">The command.</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpDelete]
    public async Task<ActionResult<Unit>> Delete(Delete.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
}