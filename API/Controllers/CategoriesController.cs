using Application.Categories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CategoriesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories(bool orderByArticleCount)
    {
        var result = await Mediator.Send(new List.Query
        {
            OrderByArticleCount = orderByArticleCount
        });
        return HandleResult(result);
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Unit>> Create(string name)
    {
        var result = await Mediator.Send(new Create.Command { Name = name});
        return HandleResult(result);
    }
    
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