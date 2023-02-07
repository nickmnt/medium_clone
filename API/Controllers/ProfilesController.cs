using Application.AppUsers;
using Application.Articles;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using List = Application.AppUsers.List;
using Update = Application.AppUsers.Update;

namespace API.Controllers;

public class ProfilesController : BaseApiController
{
    /// <summary>
    /// Returns the list of profiles.
    /// </summary>
    /// <param name="orderByArticleLikes">Should they be ordered by the # of article likes? (descending)</param>
    /// <returns></returns>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<ProfileDto>>> GetProfiles(bool orderByArticleLikes)
    {
        var result = await Mediator.Send(new List.Query {OrderByArticleLikes = orderByArticleLikes});
        return HandleResult(result);
    }
    
    /// <summary>
    /// Returns the list of saved articles of the current user..
    /// </summary>
    /// <returns></returns>
    [HttpGet("saved")]
    public async Task<ActionResult<List<ArticleDto>>> GetSavedArticles()
    {
        var result = await Mediator.Send(new ListSaves.Query());
        return HandleResult(result);
    }
    
    /// <summary>
    /// Changes the isActive property of a user. (Must be admin)
    /// </summary>
    /// <param name="command">The command.</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpPut("activation")]
    public async Task<ActionResult<Unit>> ToggleActivation(ToggleActivation.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
    
    /// <summary>
    /// Updates the target profile. (Must be logged in as that user)
    /// </summary>
    /// <param name="command">The command.</param>
    /// <returns></returns>
    [Authorize(Policy = "IsProfileOwner")]
    [HttpPut("update")]
    public async Task<ActionResult<Unit>> UpdateProfile(Update.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
    
    /// <summary>
    /// Updates the target profile. (Must be admin)
    /// </summary>
    /// <param name="command">The command.</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpPut("admin-update")]
    public async Task<ActionResult<Unit>> UpdateProfileAdmin(Update.Command command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
}