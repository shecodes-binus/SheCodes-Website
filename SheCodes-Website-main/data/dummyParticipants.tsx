import type { EventParticipant } from '@/types/eventParticipant'; 

// Helper to create a simplified ISO date string (YYYY-MM-DD)
const createRegDate = (year: number, month: number, day: number): string => {
    const date = new Date(year, month - 1, day); // Month is 0-indexed
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

export const dummyEventParticipants: EventParticipant[] = [
  {
    id: 1,
    event_id: 1,
    member_id: 1,
    registration_date: "2025-05-01",
    status: "registered",
    certificate_url: "https://marketplace.canva.com/EAFlVDzb7sA/3/0/1600w/canva-white-gold-elegant-modern-certificate-of-participation-Qn4Rei141MM.jpg",
  },
  {
    id: 2,
    event_id: 1,
    member_id: 3,
    registration_date: "2025-05-05",
    status: "registered",
  },
  {
    id: 3,
    event_id: 1,
    member_id: 6,
    registration_date: "2025-05-10",
    status: "registered",
  },
  {
    id: 4,
    event_id: 2,
    member_id: 2,
    registration_date: "2025-06-01",
    status: "registered",
  },
  {
    id: 5,
    event_id: 2,
    member_id: 5,
    registration_date: "2025-06-03",
    status: "registered",
  },
  {
    id: 6,
    event_id: 2,
    member_id: 7,
    registration_date: "2025-06-05",
    status: "registered",
  },
  {
    id: 7,
    event_id: 4,
    member_id: 1,
    registration_date: "2025-04-01",
    status: "registered",
  },
  {
    id: 8,
    event_id: 4,
    member_id: 8,
    registration_date: "2025-04-05",
    status: "registered",
  },
  {
    id: 9,
    event_id: 4,
    member_id: 9,
    registration_date: "2025-04-10",
    status: "registered",
  },
  {
    id: 10,
    event_id: 4,
    member_id: 10,
    registration_date: "2025-04-12",
    status: "registered",
  },
  {
    id: 11,
    event_id: 7,
    member_id: 4,
    registration_date: "2024-01-15",
    status: "attended",
  },
  {
    id: 12,
    event_id: 7,
    member_id: 7,
    registration_date: "2024-01-20",
    status: "attended",
  },
  {
    id: 13,
    event_id: 7,
    member_id: 2,
    registration_date: "2024-01-25",
    status: "cancelled",
  },
];