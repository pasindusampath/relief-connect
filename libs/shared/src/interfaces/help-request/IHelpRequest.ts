import { HelpRequestCategory, Urgency, ContactType, HelpRequestStatus } from '../../enums';

/**
 * Help Request interface
 */
export interface IHelpRequest {
  id?: number;
  userId?: number; // User who created this help request
  lat: number;
  lng: number;
  category: HelpRequestCategory;
  urgency: Urgency;
  shortNote: string;
  approxArea: string;
  contactType: ContactType;
  contact?: string;
  // Team/People data
  name?: string; // Name of the requester
  totalPeople?: number; // Total number of people
  elders?: number; // Number of elders/adults
  children?: number; // Number of children
  pets?: number; // Number of pets
  status?: HelpRequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

