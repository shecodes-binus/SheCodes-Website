export interface EventParticipant {
    id: number,
    event_id: number;        // Foreign key linking to CombinedEventData.id
    member_id: number;       // Foreign key linking to Member.id
    registration_date: string; // ISO 8601 format date string (e.g., "2024-05-15T10:00:00Z" or just "2024-05-15")
    status: 'registered' | 'attended' | 'cancelled'; // Status of the participation
    certificate_url?: string; 
    feedback?: string; 
  }