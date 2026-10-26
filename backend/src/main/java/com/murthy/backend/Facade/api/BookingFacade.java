package com.murthy.backend.Facade.api;

import com.murthy.backend.dto.request.BookingRequest;
import com.murthy.backend.dto.response.*;
import com.murthy.backend.enums.BookingStatus;
import com.murthy.backend.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
    Page<AdminBookingsListResponse> getBookings(BookingStatus status, Pageable pageable);
    CancelBookingResponse cancelBookingByAdmin(String bookingId);
}
