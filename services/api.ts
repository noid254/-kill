import { API_BASE_URL } from '../config';
import type { ServiceProvider, CatalogueItem, Document, Invitation, SpecialBanner, InboxMessage, Event, Premise, Gig, Ticket } from '../types';

// --- Auth Token Helpers ---
export const getToken = (): string | null => localStorage.getItem('authToken');
export const setToken = (token: string): void => localStorage.setItem('authToken', token);
export const clearToken = (): void => localStorage.removeItem('authToken');

// --- API Fetch Helper ---
const handleResponse = async (response: Response) => {
    if (response.status === 204) {
        return null; // No content for DELETE requests
    }
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
};

const apiFetch = (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers }).then(handleResponse);
};

// --- Auth API ---
export const sendOtp = (phone: string): Promise<{ success: boolean }> => 
    apiFetch('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) });

export interface VerifyOtpResponse {
    success: boolean;
    user: ServiceProvider | null;
    isSuperAdmin: boolean;
    token: string;
}

export const verifyOtp = (phone: string, otp: string): Promise<VerifyOtpResponse> => 
    apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) });

export const getMyProfile = (): Promise<ServiceProvider> => apiFetch('/users/me');

// --- Data Fetching (GET) ---
export const getProviders = (): Promise<ServiceProvider[]> => apiFetch('/providers');
export const getEvents = (): Promise<Event[]> => apiFetch('/events');
export const getGigs = (): Promise<Gig[]> => apiFetch('/gigs');
export const getCatalogueItems = (): Promise<CatalogueItem[]> => apiFetch('/catalogue');
export const getDocuments = (): Promise<Document[]> => apiFetch('/documents');
export const getInvitations = (): Promise<Invitation[]> => apiFetch('/invitations');
export const getSpecialBanners = (): Promise<SpecialBanner[]> => apiFetch('/banners');
export const getInboxMessages = (): Promise<InboxMessage[]> => apiFetch('/messages');
export const getCategories = (): Promise<string[]> => apiFetch('/categories');
export const getTickets = (): Promise<Ticket[]> => apiFetch('/tickets');

// --- Data Creation (POST) ---
export const createProvider = (providerData: Omit<ServiceProvider, 'id'>): Promise<ServiceProvider> =>
    apiFetch('/providers', { method: 'POST', body: JSON.stringify(providerData) });

export const addEvent = (eventData: Omit<Event, 'id'>): Promise<Event> =>
    apiFetch('/events', { method: 'POST', body: JSON.stringify(eventData) });

export const createGig = (gigData: Omit<Gig, 'id' | 'providerId'>): Promise<Gig> =>
    apiFetch('/gigs', { method: 'POST', body: JSON.stringify(gigData) });
    
export const addDocument = (docData: Omit<Document, 'id'>): Promise<Document> =>
    apiFetch('/documents', { method: 'POST', body: JSON.stringify(docData) });

export const createInvitation = (invitationData: Omit<Invitation, 'id' | 'status' | 'accessCode' | 'type'>, type: 'Invite' | 'Knock'): Promise<Invitation> =>
    apiFetch('/invitations', { method: 'POST', body: JSON.stringify({ ...invitationData, type }) });
    
export const registerPremise = (name: string, superhostId: string): Promise<Premise> =>
    apiFetch('/premises', { method: 'POST', body: JSON.stringify({ name, superhostId }) });

// --- Data Modification (PUT) ---
export const updateProvider = (updatedProvider: ServiceProvider): Promise<ServiceProvider> =>
    apiFetch(`/providers/${updatedProvider.id}`, { method: 'PUT', body: JSON.stringify(updatedProvider) });

export const updateDocument = (updatedDoc: Document): Promise<Document> =>
    apiFetch(`/documents/${updatedDoc.id}`, { method: 'PUT', body: JSON.stringify(updatedDoc) });

export const updateInvitation = (invitationId: string, status: Invitation['status']): Promise<Invitation> =>
    apiFetch(`/invitations/${invitationId}`, { method: 'PUT', body: JSON.stringify({ status }) });

export const initiateAssetTransfer = (documentId: string, newOwnerPhone: string): Promise<Document> =>
    apiFetch(`/documents/${documentId}/transfer`, { method: 'POST', body: JSON.stringify({ newOwnerPhone }) });
    
export const finalizeAssetTransfer = (documentId: string, decision: 'accept' | 'deny'): Promise<Document> =>
    apiFetch(`/documents/${documentId}/transfer/finalize`, { method: 'POST', body: JSON.stringify({ decision }) });

// --- Data Deletion (DELETE) ---
export const deleteProvider = (providerId: string): Promise<void> =>
    apiFetch(`/providers/${providerId}`, { method: 'DELETE' });

// --- Search ---
export const searchAssetBySerialOrReg = (identifier: string): Promise<Document | null> =>
    apiFetch(`/assets/search?q=${encodeURIComponent(identifier)}`);
