export interface Member {
  id: string;
  email: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  name: string;
  role: 'admin' | 'mentor' | 'member' | 'alumni';
  about_me?: string | null;
  birth_date?: string | null; // ISO date string
  gender?: string | null;
  phone?: string | null;
  occupation?: string | null;
  cv_link?: string | null;
  linkedin?: string | null;
  profile_picture?: string | null;
}