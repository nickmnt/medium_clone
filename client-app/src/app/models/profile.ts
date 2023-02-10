export interface Profile {
  username: string;
  displayName: string;
  bio: string;
  image: string;
  isActive: boolean;
  likedCount: number;
}

export interface ProfileFormValues {
  bio: string;
  displayName: string;
}
