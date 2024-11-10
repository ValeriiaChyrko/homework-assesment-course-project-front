export interface RespondTeacherDto {
    userId: string;
    gitHubProfileId: string;
    fullName: string;
    email: string;
    password: string;
    githubUsername: string;
    githubAccessToken: string;
    githubProfileUrl: string;
    githubPictureUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
