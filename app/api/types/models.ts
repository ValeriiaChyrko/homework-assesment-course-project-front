// UUID type definition to represent UUIDs
type UUID = string;

interface Course {
    id: UUID;
    userId: UUID;
    title: string;
    description?: string;
    imageUrl?: string;
    isPublished: boolean;
    categoryId?: UUID;
    createdAt: Date;
    updatedAt: Date;
    chapters: Chapter[];
    attachments: Attachment[];
    enrollments: Enrollment[];
}

interface Category {
    id: UUID;
    name: string;
    courses: Course[];
}

interface Attachment {
    id: UUID;
    name: string;
    url: string;
    courseId: UUID;
    createdAt: Date;
    updatedAt: Date;
}

interface Chapter {
    id: UUID;
    title: string;
    description?: string;
    videoUrl?: string;
    position: number;
    isPublished: boolean;
    isFree: boolean;
    courseId: UUID;
    muxData?: MuxData;
    assignments: Assignment[];
    createdAt: Date;
    updatedAt: Date;
}

interface Assignment {
    id: UUID;
    title: string;
    description?: string;
    repositoryName?: string;
    repositoryOwner?: string;
    repositoryUrl?: string;
    deadline: Date;
    maxScore: number;
    maxAttemptsAmount: number;
    position: number;
    isPublished: boolean;
    attemptCompilationSectionEnable: boolean;
    attemptTestsSectionEnable: boolean;
    attemptQualitySectionEnable: boolean;
    attemptCompilationMaxScore: number;
    attemptCompilationMinScore: number;
    attemptTestsMaxScore: number;
    attemptTestsMinScore: number;
    attemptQualityMaxScore: number;
    attemptQualityMinScore: number;
    chapterId: UUID;
    createdAt: Date;
    updatedAt: Date;
}

interface AttemptProgress {
    id: UUID;
    userId: UUID;
    assignmentId: UUID;
    position: number;
    brachName?: string;
    finalScore: number;
    compilationScore: number;
    qualityScore: number;
    testsScore: number;
    progressStatus: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface MuxData {
    id: UUID;
    assetId: string;
    playbackId?: string;
    chapterId: UUID;
}

interface UserProgress {
    id: UUID;
    userId: UUID;
    chapterId: UUID;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface Enrollment {
    id: UUID;
    userId: UUID;
    courseId: UUID;
    createdAt: Date;
    updatedAt: Date;
}