using Application.Categories;
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
}