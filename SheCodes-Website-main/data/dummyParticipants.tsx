// data/dummyEventParticipants.ts (Updated)

import type { EventParticipant } from '@/types/eventParticipant'; 
import type { CombinedEventData } from '@/types/events';
import { allEventsData } from './dummyEvent'; // <-- Import your dummy event data

// Step 1: Keep your original data in a raw, simple format. This is easier to read.
const rawParticipants = [
  {
    id: 1,
    event_id: 1,
    member_id: "1",
    registration_date: "2025-05-01",
    status: "registered" as const, // Use "as const" for stricter typing on status
    certificate_url: "https://marketplace.canva.com/EAFlVDzb7sA/3/0/1600w/canva-white-gold-elegant-modern-certificate-of-participation-Qn4Rei141MM.jpg",
  },
  {
    id: 2,
    event_id: 1,
    member_id: "3",
    registration_date: "2025-05-05",
    status: "registered" as const,
  },
  {
    id: 3,
    event_id: 1,
    member_id: "6",
    registration_date: "2025-05-10",
    status: "registered" as const,
  },
  {
    id: 4,
    event_id: 2,
    member_id: "2",
    registration_date: "2025-06-01",
    status: "registered" as const,
  },
  // ... continue for all other participants ...
  {
    id: 13,
    event_id: 7,
    member_id: "2",
    registration_date: "2024-01-25",
    status: "cancelled" as const,
  },
];

// Step 2: Create a quick-lookup map for events by their ID for efficiency.
const eventsMap = new Map<number, CombinedEventData>(
    allEventsData.map(event => [event.id, event])
);

// Step 3: Map over the raw participant data and add the required 'event' property.
export const dummyEventParticipants: EventParticipant[] = rawParticipants.map(participant => {
  const eventData = eventsMap.get(participant.event_id);

  // This check helps find errors in your dummy data.
  if (!eventData) {
    throw new Error(`Dummy data error: Event with ID ${participant.event_id} was not found in allEventsData.`);
  }

  // Return a new object that includes all original properties plus the looked-up event data.
  return {
    ...participant,
    event: eventData, // This adds the required 'event' property.
  };
});