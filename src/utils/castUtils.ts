/**
 * Utility functions for cast and crew data processing
 */

import type { CrewMember, OrganizedCrew, CrewDepartment, CastMember, Person } from '../types/cast';

// Department mapping for crew organization
const DEPARTMENT_MAPPING: Record<string, CrewDepartment> = {
  'Directing': 'Directing',
  'Writing': 'Writing',
  'Production': 'Production',
  'Camera': 'Cinematography',
  'Cinematography': 'Cinematography',
  'Editing': 'Editing',
  'Music': 'Music',
  'Sound': 'Sound',
  'Visual Effects': 'Visual Effects',
  'Art': 'Art',
  'Costume': 'Costume & Make-Up',
  'Make-Up': 'Costume & Make-Up',
  'Hair': 'Costume & Make-Up',
  'Makeup': 'Costume & Make-Up',
} as const;

/**
 * Organizes crew members by department
 */
export function organizeCrew(crew: CrewMember[]): OrganizedCrew {
  const organized: OrganizedCrew = {};
  
  crew.forEach((member) => {
    const department = normalizeDepartment(member.department);
    
    if (!organized[department]) {
      organized[department] = [];
    }
    
    organized[department]!.push(member);
  });
  
  // Sort each department by job importance and name
  Object.keys(organized).forEach((dept) => {
    const department = dept as CrewDepartment;
    organized[department] = organized[department]?.sort((a, b) => {
      // Prioritize key roles
      const jobPriority = getJobPriority(a.job) - getJobPriority(b.job);
      if (jobPriority !== 0) return jobPriority;
      
      // Then sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
  });
  
  return organized;
}

/**
 * Normalizes department names to standard categories
 */
export function normalizeDepartment(department: string): CrewDepartment {
  const normalized = DEPARTMENT_MAPPING[department];
  if (normalized) return normalized;
  
  // Fuzzy matching for common variations
  const lowerDept = department.toLowerCase();
  
  if (lowerDept.includes('director') || lowerDept.includes('directing')) {
    return 'Directing';
  }
  if (lowerDept.includes('writer') || lowerDept.includes('writing') || lowerDept.includes('screenplay')) {
    return 'Writing';
  }
  if (lowerDept.includes('producer') || lowerDept.includes('production')) {
    return 'Production';
  }
  if (lowerDept.includes('camera') || lowerDept.includes('cinematography') || lowerDept.includes('photography')) {
    return 'Cinematography';
  }
  if (lowerDept.includes('edit')) {
    return 'Editing';
  }
  if (lowerDept.includes('music') || lowerDept.includes('composer') || lowerDept.includes('score')) {
    return 'Music';
  }
  if (lowerDept.includes('sound') || lowerDept.includes('audio')) {
    return 'Sound';
  }
  if (lowerDept.includes('visual') || lowerDept.includes('vfx') || lowerDept.includes('effects')) {
    return 'Visual Effects';
  }
  if (lowerDept.includes('art') || lowerDept.includes('design') || lowerDept.includes('decoration')) {
    return 'Art';
  }
  if (lowerDept.includes('costume') || lowerDept.includes('makeup') || lowerDept.includes('hair')) {
    return 'Costume & Make-Up';
  }
  
  return 'Other';
}

/**
 * Returns priority order for job roles (lower number = higher priority)
 */
function getJobPriority(job: string): number {
  const lowerJob = job.toLowerCase();
  
  // Director roles
  if (lowerJob.includes('director') && !lowerJob.includes('assistant')) return 1;
  
  // Producer roles
  if (lowerJob.includes('producer') && !lowerJob.includes('associate')) return 2;
  if (lowerJob.includes('executive producer')) return 3;
  
  // Writer roles
  if (lowerJob.includes('writer') || lowerJob.includes('screenplay')) return 4;
  
  // Key technical roles
  if (lowerJob.includes('cinematographer') || lowerJob.includes('director of photography')) return 5;
  if (lowerJob.includes('editor')) return 6;
  if (lowerJob.includes('composer')) return 7;
  
  return 10; // Default priority
}

/**
 * Filters cast and crew based on search criteria
 */
export function filterPeople<T extends Person>(
  people: T[],
  query: string
): T[] {
  if (!query.trim()) return people;
  
  const searchTerm = query.toLowerCase().trim();
  
  return people.filter((person) => {
    const nameMatch = person.name.toLowerCase().includes(searchTerm);
    
    // Type-specific matching
    if ('character' in person) {
      // Cast member - also search character name
      const characterMatch = (person as any).character.toLowerCase().includes(searchTerm);
      return nameMatch || characterMatch;
    }
    
    if ('job' in person) {
      // Crew member - also search job and department
      const jobMatch = (person as any).job.toLowerCase().includes(searchTerm);
      const deptMatch = (person as any).department.toLowerCase().includes(searchTerm);
      return nameMatch || jobMatch || deptMatch;
    }
    
    return nameMatch;
  });
}

/**
 * Gets initials from a person's name for avatar fallback
 */
export function getPersonInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Formats a person's role for display
 */
export function formatPersonRole(person: CastMember | CrewMember): string {
  if ('character' in person) {
    return `as ${person.character}`;
  }
  
  if ('job' in person) {
    return person.job;
  }
  
  return '';
}

/**
 * Groups cast members by character importance/billing order
 */
export function groupCastByImportance(cast: CastMember[]): {
  main: CastMember[];
  supporting: CastMember[];
  other: CastMember[];
} {
  const sorted = [...cast].sort((a, b) => a.order - b.order);
  
  return {
    main: sorted.slice(0, 5), // Top 5 billing
    supporting: sorted.slice(5, 15), // Next 10
    other: sorted.slice(15), // Rest
  };
}

/**
 * Gets department display name with icon
 */
export function getDepartmentDisplay(department: CrewDepartment): {
  name: string;
  icon: string;
} {
  const displays: Record<CrewDepartment, { name: string; icon: string }> = {
    'Directing': { name: 'Directing', icon: '🎬' },
    'Writing': { name: 'Writing', icon: '✍️' },
    'Production': { name: 'Production', icon: '🎭' },
    'Cinematography': { name: 'Cinematography', icon: '📹' },
    'Editing': { name: 'Editing', icon: '✂️' },
    'Music': { name: 'Music', icon: '🎵' },
    'Sound': { name: 'Sound', icon: '🔊' },
    'Visual Effects': { name: 'Visual Effects', icon: '✨' },
    'Art': { name: 'Art Direction', icon: '🎨' },
    'Costume & Make-Up': { name: 'Costume & Make-Up', icon: '👗' },
    'Other': { name: 'Other', icon: '🛠️' },
  };
  
  return displays[department] || displays['Other'];
}