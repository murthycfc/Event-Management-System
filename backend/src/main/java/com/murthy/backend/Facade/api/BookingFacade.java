package com.murthy.backend.Facade.api;

import com.murthy.backend.dto.request.BookingRequest;
import com.murthy.backend.dto.response.*;

import java.util.List;
import java.util.UUID;

public interface BookingFacade {
    BookingResponse bookSeats(BookingRequest request);
    BaseResponseDTO cancelSelectedSeats(String bookingId);
    BookingSuccessResponse pay(UUID bookingId);
    List<MyBookingResponse> myBookings();
    BookingDetails viewBooking(UUID bookingId);
    AdminDashboardResponse getDashboard();
    CancelBookingResponse cancel(UUID bookingId);
}
