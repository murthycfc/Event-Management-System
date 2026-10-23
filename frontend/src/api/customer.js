
import apiClient from "./apiClient";


export async function loadEvents(filters={}, page=0, size=10) {
    const params = Object.fromEntries(
        Object.entries(filters).filter(
            ([key, value]) => value !== ""
        )
    );
    params.page = page;
    params.size = size;
    const response = await apiClient.get(`/api/events`,{
        params
    });
    return response.data;
}

export async function loadEventDetails(eventId) {
    const response = await apiClient.get(`/api/events/${eventId}/details`);
    return response.data;
}

export async function loadSeats(eventId) {
    const response = await apiClient.get(`/api/events/${eventId}/seats`);
    return response.data;
}

export async function continueBooking(selectedSeats) {
    const payload = {
        eventSeatIds : selectedSeats.map(seat => seat.id)
    }
    const response = await apiClient.post(`/api/bookSeats`, payload);
    return response.data;
}

export async function bookingDetails(bookingId) {
    const response = await apiClient.get(`/api/myBookings/${bookingId}/view`);
    return response.data;
}

export async function confirmPay(bookingId) {
    const response = await apiClient.post(`/api/bookings/${bookingId}/pay`);
    return response.data;
}

export async function cancelSeletedSeats(bookingId) {
    const response = await apiClient.put(`/api/bookings/${bookingId}/cancelSelectedSeats`);
    return response.data;
}

export async function myBookings() {
    const response = await apiClient.get(`/api/myBookings`);
    return response.data;
}

export async function myBookingDetails(bookingId) {
    const response = await apiClient.get(`/api/myBookings/${bookingId}/view`);
    return response.data;
}

export async function cancelBooking(bookingId) {
    const response = await apiClient.put(`/api/myBookings/${bookingId}/cancel`);
    return response.data;
}