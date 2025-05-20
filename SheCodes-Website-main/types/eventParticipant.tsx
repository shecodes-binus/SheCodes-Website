export interface EventParticipant {
    eventId: number;        // Foreign key linking to CombinedEventData.id
    memberId: number;       // Foreign key linking to Member.id
    registrationDate: string; // ISO 8601 format date string (e.g., "2024-05-15T10:00:00Z" or just "2024-05-15")
    status: 'registered' | 'attended' | 'cancelled'; // Status of the participation
    certificateUrl?: string; 
    feedback?: string; 
  }