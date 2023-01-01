namespace Application.AppUsers;

public class ProfileDto
{
    public string Username { get; set; }
    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public bool IsActive { get; set; }
    public int LikedCount { get; set; }
}