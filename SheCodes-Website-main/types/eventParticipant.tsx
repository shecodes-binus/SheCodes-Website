import { CombinedEventData } from "./events";
import { Member } from "./members";

export interface EventParticipant {
    id: number;
    event_id: number;        // Foreign key to CombinedEventData.id
    member_id: string;       // CORRECTED: Foreign key to Member.id (which is a string/UUID)
    registration_date: string; // ISO 8601 format date string
    status: 'registered' | 'attended' | 'cancelled'; // Status of the participation
    certificate_url?: string; 
    feedback?: string; 
    event: CombinedEventData; // MODIFIED: Make optional, as it's not present on creation
    user: Member;
}