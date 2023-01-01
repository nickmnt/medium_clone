using Application.AppUsers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<ProfileDto>>> GetProfiles(bool orderByArticleLikes)
    {
        var result = await Mediator.Send(new List.Query {OrderByArticleLikes = orderByArticleLikes});
        return HandleResult(result);
    }
    
    [HttpPut]
    public async Task<ActionResult<Unit>> ToggleActivation(string targetUsername, bool newIsActive)
    {
        var result = await Mediator.Send(new ToggleActivation.Command {targetUsername = targetUsername, 
            newIsActive = newIsActive});
        return HandleResult(result);
    }
    
    [Authorize(Policy = "IsProfileOwner")]
    [HttpPut]
    public async Task<ActionResult<Unit>> UpdateProfile(string targetUsername, string bio, string displayName)
    {
        var result = await Mediator.Send(new Update.Command {TargetUsername = targetUsername, 
            Bio = bio, DisplayName = displayName});
        return HandleResult(result);
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult<Unit>> UpdateProfileAdmin(string targetUsername, string bio, string displayName)
    {
        var result = await Mediator.Send(new Update.Command {TargetUsername = targetUsername, 
            Bio = bio, DisplayName = displayName});
        return HandleResult(result);
    }
}