export interface RequestStudentDto {
    fullName: string;
    email: string;
    password: string;
    githubUsername: string;
    githubProfileUrl: string;
    githubPictureUrl?: string;
}