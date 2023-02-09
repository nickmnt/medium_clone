using API.DTOs;
using Application.AppUsers;
using Application.Articles;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using List = Application.AppUsers.List;
using Update = Application.AppUsers.Update;

namespace API.Controllers;

public class ProfilesController : BaseApiController
{
    private readonly IUserAccessor _accessor;

    public ProfilesController(IUserAccessor accessor)
    {
        _accessor = accessor;
    }
    
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
    /// Updates the profile of the current user.
    /// </summary>
    /// <param name="dto">The details of the updated profile</param>
    /// <returns></returns>
    [HttpPut("update")]
    public async Task<ActionResult<Unit>> UpdateProfile(ProfileUpdateDto dto)
    {
        var result = await Mediator.Send(new Update.Command
        {
            Bio = dto.Bio, DisplayName = dto.DisplayName,
            TargetUsername = _accessor.GetUsername()
        });
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