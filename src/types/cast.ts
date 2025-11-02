/**
 * Cast and Crew interfaces for movie personnel data
 * These types provide comprehensive type safety for cast and crew information
 */

// Base person interface for cast and crew members
export interface Person {
  readonly id: string;
  readonly name: string;
  readonly profileImage?: string;
  readonly birthDate?: string;
  readonly biography?: string;
  readonly knownFor?: string[];
}

// Cast member interface extending Person
export interface CastMember extends Person {
  readonly character: string;
  readonly order: number; // billing order
  readonly characterImage?: string;
}

// Crew member interface extending Person
export interface CrewMember extends Person {
  readonly job: string;
  readonly department: string;
}

// Department categories for organizing crew
export type CrewDepartment = 
  | 'Directing'
  | 'Writing' 
  | 'Production'
  | 'Cinematography'
  | 'Editing'
  | 'Music'
  | 'Sound'
  | 'Visual Effects'
  | 'Art'
  | 'Costume & Make-Up'
  | 'Other';

// Organized crew structure by department
export interface OrganizedCrew {
  readonly [key in CrewDepartment]?: CrewMember[];
}

// Complete cast and crew data structure
export interface CastAndCrew {
  readonly cast: CastMember[];
  readonly crew: CrewMember[];
  readonly organizedCrew: OrganizedCrew;
}

// Props for CastCrew component
export interface CastCrewProps {
  readonly cast: CastMember[];
  readonly crew: CrewMember[];
  readonly className?: string;
  readonly maxCastVisible?: number;
  readonly maxCrewPerDepartment?: number;
  readonly showSearch?: boolean;
  readonly onPersonClick?: (person: Person) => void;
}

// Search and filter types
export interface PersonFilter {
  readonly query: string;
  readonly department?: CrewDepartment;
  readonly role?: 'cast' | 'crew' | 'all';
}

// Person card props for individual display
export interface PersonCardProps {
  readonly person: CastMember | CrewMember;
  readonly role: 'cast' | 'crew';
  readonly onClick?: (person: Person) => void;
  readonly className?: string;
}

// Utility type guards
export function isCastMember(person: CastMember | CrewMember): person is CastMember {
  return 'character' in person;
}

export function isCrewMember(person: CastMember | CrewMember): person is CrewMember {
  return 'job' in person && 'department' in person;
}