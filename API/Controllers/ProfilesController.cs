using Application.AppUsers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController : BaseApiController
{
    /// <summary>
    /// Returns the list of profiles.
    /// </summary>
    /// <param name="orderByArticleLikes">Should they be ordered by the # of article likes? (descending)</param>
    /// <returns></returns>
    [HttpGet]
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
    public async Task<ActionResult<List<ProfileDto>>> GetSavedArticles()
    {
        var result = await Mediator.Send(new ListSaves.Query());
        return HandleResult(result);
    }
    
    /// <summary>
    /// Changes the isActive property of a user. (Must be admin)
    /// </summary>
    /// <param name="targetUsername">Username of the target user.</param>
    /// <param name="newIsActive">New isActive value.</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpPut("activation")]
    public async Task<ActionResult<Unit>> ToggleActivation(string targetUsername, bool newIsActive)
    {
        var result = await Mediator.Send(new ToggleActivation.Command {targetUsername = targetUsername, 
            newIsActive = newIsActive});
        return HandleResult(result);
    }
    
    /// <summary>
    /// Updates the target profile. (Must be logged in as that user)
    /// </summary>
    /// <param name="targetUsername">Username of target.</param>
    /// <param name="bio">New bio.</param>
    /// <param name="displayName">New display name.</param>
    /// <returns></returns>
    [Authorize(Policy = "IsProfileOwner")]
    [HttpPut("update")]
    public async Task<ActionResult<Unit>> UpdateProfile(string targetUsername, string bio, string displayName)
    {
        var result = await Mediator.Send(new Update.Command {TargetUsername = targetUsername, 
            Bio = bio, DisplayName = displayName});
        return HandleResult(result);
    }
    
    /// <summary>
    /// Updates the target profile. (Must be admin)
    /// </summary>
    /// <param name="targetUsername">Username of target.</param>
    /// <param name="bio">New bio.</param>
    /// <param name="displayName">New display name.</param>
    /// <returns></returns>
    [Authorize(Roles = "Admin")]
    [HttpPut("admin-update")]
    public async Task<ActionResult<Unit>> UpdateProfileAdmin(string targetUsername, string bio, string displayName)
    {
        var result = await Mediator.Send(new Update.Command {TargetUsername = targetUsername, 
            Bio = bio, DisplayName = displayName});
        return HandleResult(result);
    }
}