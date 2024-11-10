export interface RequestStudentDto {
    fullName: string;
    email: string;
    password: string;
    githubUsername: string;
    githubAccessToken: string;
    githubProfileUrl: string;
    githubPictureUrl?: string;
}