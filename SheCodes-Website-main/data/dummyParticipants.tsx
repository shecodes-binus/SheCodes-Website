import type { EventParticipant } from '@/types/eventParticipant'; 

// Helper to create a simplified ISO date string (YYYY-MM-DD)
const createRegDate = (year: number, month: number, day: number): string => {
    const date = new Date(year, month - 1, day); // Month is 0-indexed
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

export const dummyEventParticipants: EventParticipant[] = [
    // Participants for Event 1: Intro to Web Development (ID: 1, Starts: June 15, 2025)
    {
        eventId: 1,
        memberId: 1, // Alice Johnson
        registrationDate: createRegDate(2025, 5, 1), // May 1, 2025
        status: 'registered',
        certificateUrl: 'https://marketplace.canva.com/EAFlVDzb7sA/3/0/1600w/canva-white-gold-elegant-modern-certificate-of-participation-Qn4Rei141MM.jpg',
    },
    {
        eventId: 1,
        memberId: 3, // Cindy Tan
        registrationDate: createRegDate(2025, 5, 5), // May 5, 2025
        status: 'registered',
    },
    {
        eventId: 1,
        memberId: 6, // Farhan Yusuf
        registrationDate: createRegDate(2025, 5, 10), // May 10, 2025
        status: 'registered',
    },

    // Participants for Event 2: AI in Modern Tech (ID: 2, Starts: June 22, 2025)
    {
        eventId: 2,
        memberId: 2, // Bob Smith
        registrationDate: createRegDate(2025, 6, 1), // June 1, 2025
        status: 'registered',
    },
    {
        eventId: 2,
        memberId: 5, // Eva Martinez
        registrationDate: createRegDate(2025, 6, 3), // June 3, 2025
        status: 'registered',
    },
    {
        eventId: 2,
        memberId: 7, // Grace Liu
        registrationDate: createRegDate(2025, 6, 5), // June 5, 2025
        status: 'registered',
    },

    // Participants for Event 4: Data Analysis with Python (ID: 4, Starts: April 24, 2025)
    {
        eventId: 4,
        memberId: 1, // Alice Johnson (Participating in multiple events)
        registrationDate: createRegDate(2025, 4, 1), // April 1, 2025
        status: 'registered',
    },
    {
        eventId: 4,
        memberId: 8, // Hendro Wibowo
        registrationDate: createRegDate(2025, 4, 5), // April 5, 2025
        status: 'registered',
    },
    {
        eventId: 4,
        memberId: 9, // Intan Permata
        registrationDate: createRegDate(2025, 4, 10), // April 10, 2025
        status: 'registered',
    },
    {
        eventId: 4,
        memberId: 10, // Jonathan Chandra
        registrationDate: createRegDate(2025, 4, 12), // April 12, 2025
        status: 'registered',
    },

    // Participants for Event 7: Tech Talk: Cloud Computing (ID: 7, Past Event: Feb 12, 2024)
    {
        eventId: 7,
        memberId: 4, // David Lee
        registrationDate: createRegDate(2024, 1, 15), // Jan 15, 2024
        status: 'attended', // Attended past event
    },
    {
        eventId: 7,
        memberId: 7, // Grace Liu (Participating in multiple events)
        registrationDate: createRegDate(2024, 1, 20), // Jan 20, 2024
        status: 'attended',
    },
    {
        eventId: 7,
        memberId: 2, // Bob Smith (Registered but didn't attend)
        registrationDate: createRegDate(2024, 1, 25), // Jan 25, 2024
        status: 'cancelled', // Or could be 'registered' if you don't track cancellations
    },
];