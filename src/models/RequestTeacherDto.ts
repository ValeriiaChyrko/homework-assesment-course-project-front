﻿export interface RequestTeacherDto {
    fullName: string;
    email: string;
    password: string;
    githubUsername: string;
    githubAccessToken: string;
    githubProfileUrl: string;
    githubPictureUrl?: string;
}