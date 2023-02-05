using Application.Categories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    /// <param name="name">The name of the new category.</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Unit>> Create(string name)
    {
        var result = await Mediator.Send(new Create.Command { Name = name});
        return HandleResult(result);
    }
    
    /// <summary>
    /// Updates an existing category. (Must be admin)
    /// </summary>
    /// <param name="name">The new name of the category.</param>
    /// <param name="categoryId">Id of the category.</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult<Unit>> Update(string name, int categoryId)
    {
        var result = await Mediator.Send(new Update.Command {
            Name = name,
            CategoryId = categoryId
        });
        return HandleResult(result);
    }
    
    /// <summary>
    /// Deletes a category. (Must be admin)
    /// </summary>
    /// <param name="categoryId">Id of the category.</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpDelete]
    public async Task<ActionResult<Unit>> Delete(int categoryId)
    {
        var result = await Mediator.Send(new Delete.Command {
            CategoryId = categoryId
        });
        return HandleResult(result);
    }
}