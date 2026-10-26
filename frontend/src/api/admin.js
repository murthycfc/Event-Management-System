import apiClient from "./apiClient";

export async function getDashboard() {
    const response = await apiClient.get(`/admin/getDashboard`);
    return response.data;
}

export async function getVenues(name, page) {
    const params = name ? {name, page} : {name:"",page};
    const response = await apiClient.get(`/admin/getVenues`, {params});
    return response.data;
}

export async function createVenue(requestedData) {
    const response = await apiClient.post(`/admin/createVenue`, requestedData);
    return response.data;
}

export async function getAllEvents(page) {
    const response = await apiClient.get(`/admin/getAllEvents`,{
        params: {page}
    });
    return response.data;
}

export async function getEventForEdit(eventId) {
    const response = await apiClient.get(`/admin/events/${eventId}`);
    return response.data;
}

export async function updateEvent(eventId, formData) {
    const response = await apiClient.put(`/admin/events/${eventId}`, formData);
    return response.data;
}

export async function deleteEvent(eventId) {
    const response = await apiClient.delete(`/admin/events/${eventId}`);
    return response.data;
}

export async function getVenueDetails(venueId) {
    const response = await apiClient.get(`/admin/venue/${venueId}`);
    return response.data;
}

export async function createEvent(formData) {
    const response = await apiClient.post(`/admin/createEvent`, formData);
    return response.data;
}

export async function deleteVenue(venueId) {
    const response = await apiClient.delete(`/admin/venue/${venueId}`);
    return response.data;
}

export async function getVenueDetailsPage(venueId) {
    const response = await apiClient.get(`/admin/venue/getVenueDetailsPage/${venueId}`);
    return response.data;
}

export async function getVenueForEdit(venueId) {
    const response = await apiClient.get(`/admin/venue/getVenueForEdit/${venueId}`);
    return response.data;
}

export async function updateVenue(venueId, request) {
    const response = await apiClient.put(`/admin/venue/${venueId}/update`,request);
    return response.data;
}

export async function deactivate(seatId) {
    const response = await apiClient.patch(`/admin/venueSeat/${seatId}/deactivate`);
    return response.data;
}

export async function activate(seatId) {
    const response = await apiClient.patch(`/admin/venueSeat/${seatId}/activate`);
    return response.data;
}

export async function getBookings(status, page=0, size=10) {
    const params = status ? {status, page, size} : {page, size};
    const response = await apiClient.get(`/admin/getBookings`,{params});
    return response.data;
}

export async function viewBookingDetails(bookingId) {
    const response = await apiClient.get(`/admin/bookings/${bookingId}`);
    return response.data;
}

export async function cancelBookingByAdmin(bookingId) {
    const response = await apiClient.put(`/admin/bookings/${bookingId}`);
    return response.data;
}

export async function getVenue(venueId) {
    const response = await apiClient.get(`/admin/venue/${venueId}/details`);
    return response.data;
}

export async function getVenueOptions() {
    const response = await apiClient.get(`/admin/venues/options`);
    return response.data;
}