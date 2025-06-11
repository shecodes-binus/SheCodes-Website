export interface Member {
    id: number;
    fullName: string;
    aboutMe: string;
    birthDate: string | null;
    gender: string;
    phone: string;
    occupation: string;
    cvLink: string;
    linkedin: string;
    gmail: string;
    profilePicUrl: string;
    createdAt: string;
    updatedAt: string;
    role: 'admin' | 'mentor' | 'member' | 'alumni';
}