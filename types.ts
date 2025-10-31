// FIX: Add Page type definition to resolve import error in BottomNav.tsx
export type Page = 'home' | 'tickets' | 'explore' | 'orders' | 'profile' | 'contacts';

export interface Member {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  distanceKm: number;
  hourlyRate: number;
  rateType: 'per hour' | 'per day' | 'per task' | 'per month' | 'per piece work' | 'per km' | 'per sqm' | 'per cbm' | 'per appearance';
  phone: string;
  whatsapp?: string;
  isOnline: boolean;
}

export interface Skill {
  id: string;
  name:string;
  iconUrl: string;
  isVerified: boolean;
  verifier: {
    type: 'institution' | 'mentor';
    name: string;
    details: string;
    verifierId?: string; // Optional: Link to another ServiceProvider profile
  };
}

export interface ServiceProvider {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  service: string;
  avatarUrl: string;
  coverImageUrl: string;
  catalogueBannerUrl?: string;
  rating: number;
  distanceKm: number;
  hourlyRate: number;
  rateType: 'per hour' | 'per day' | 'per task' | 'per month' | 'per piece work' | 'per km' | 'per sqm' | 'per cbm' | 'per appearance';
  currency: string;
  isVerified: boolean;
  about: string;
  works: string[];
  skills?: Skill[];
  category: string;
  location: string;
  isOnline: boolean;
  accountType: 'individual' | 'organization';
  flagCount: number;
  views: number;
  cta: ('call' | 'whatsapp' | 'book' | 'catalogue' | 'join')[];
  profileType?: 'individual' | 'group';
  members?: Member[];
  leaders?: {
    chairperson: string; // phone number
    secretary: string; // phone number
    treasurer: string; // phone number
  };
  joinRequests?: {
    userId: string;
    userName: string;
    userPhone: string;
    status: 'pending' | 'approved' | 'rejected';
    approvals: string[]; // List of leader phone numbers who approved
    rejections: string[]; // List of leader phone numbers who rejected
  }[];
}

export interface Gig {
  id: string;
  providerId: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  budgetType: 'fixed' | 'per hour' | 'per day';
  currency: string;
  location: string;
  imageUrl: string;
}

export interface Event {
    id: string;
    name: string;
    date: string; // Keep as ISO string for sorting/parsing
    location: string;
    description: string;
    coverImageUrl: string;
    createdBy: string; // This can be the organizer's name
    category: 'Music' | 'Food' | 'Sport' | 'Conference' | 'Party' | 'Wedding' | 'Community' | 'Arts' | 'Business' | 'Fashion' | 'Gaming';
    price: number;
    originalPrice?: number;
    currency: string;
    ticketType: 'single' | 'multiple';
    distanceKm: number;
    organizer: {
        name: string;
        avatarUrl: string;
    };
    attendees: {
        avatarUrl: string;
    }[];
    teaserVideoUrl?: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  userName: string;
  qrCodeData: string;
  gate: string;
  eventCoverUrl: string;
}

export type CatalogueCategory = 'For Rent' | 'For Sale' | 'Product' | 'Service' | 'Professional Service';

export interface CatalogueItem {
  id: string;
  providerId: string;
  title: string;
  category: CatalogueCategory;
  description: string;
  price: string;
  imageUrls: string[];
  externalLink?: string;
  duration?: string;
  discountInfo?: string;
  verifiedAssetId?: string; // Link to a verified asset in the Document DB
}

export interface SpecialBanner {
  id: string;
  imageUrl: string;
  targetCategory?: string;
  targetLocation?: string;
  minRating?: number;
  targetService?: string;
  isOnlineTarget?: boolean;
  isVerifiedTarget?: boolean;
  targetReferralCode?: string;
  startDate?: string;
  endDate?: string;
}

export type DocumentType = 'Invoice' | 'Quote' | 'Receipt';

export interface DocumentItem {
  description: string;
  quantity: number;
  price: number;
  serial?: string;
}

export interface Document {
  id: string;
  type: DocumentType;
  number: string;
  issuerName: string; // 'from' renamed
  clientName?: string; // New: for invoices/quotes
  date: string;
  amount: number;
  currency: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue' | 'Draft'; // 'status' renamed

  // Fields for assets
  items?: DocumentItem[];
  scannedImageUrl?: string;
  verificationStatus?: 'Unverified' | 'Pending' | 'Verified' | 'Rejected';
  isAsset?: boolean;
  ownerPhone?: string;
  productImages?: string[];
  specifications?: string;
  pendingOwnerPhone?: string;

  // New detailed asset fields
  assetType?: 'Vehicle' | 'Tool' | 'Electronics' | 'Other';
  registrationNumber?: string; // For vehicles
  model?: string; // For vehicles, tools, electronics
  yearOfManufacture?: string; // For vehicles
  logbookImageUrl?: string; // For vehicle verification
}


export interface Invitation {
  id: string;
  hostId: string;
  hostName: string;
  hostApartment?: string;
  visitorPhone: string;
  visitorId?: string;
  visitorName?: string;
  visitorAvatar?: string;
  visitDate: string;
  status: 'Active' | 'Canceled' | 'Used' | 'Pending' | 'Approved' | 'Denied' | 'Expired';
  accessCode: string;
  type: 'Invite' | 'Knock';
}

export interface BusinessAssets {
  name: string;
  address: string;
  logo: string | null;
}

export interface InboxMessage {
  id: string;
  recipientPhone?: string; // Target specific user inboxes
  from: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  action?: {
    type: 'saccoJoinRequest' | 'assetTransfer' | 'gigApplication';
    organizationId?: string;
    requesterId?: string;
    documentId?: string;
    gigId?: string;
  };
  requesterProfile?: Partial<ServiceProvider>; // For attaching profile cards to messages
}

export interface Premise {
    id: string;
    name: string;
    superhostId: string;
    hosts: string[];
}