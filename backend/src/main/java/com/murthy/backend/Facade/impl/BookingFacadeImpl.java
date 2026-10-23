package com.murthy.backend.Facade.impl;

import com.murthy.backend.Facade.api.BookingFacade;
import com.murthy.backend.dto.request.BookingRequest;
import com.murthy.backend.dto.response.*;
import com.murthy.backend.service.api.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class BookingFacadeImpl implements BookingFacade {

    private final BookingService bookingService;

    @Override
    public BookingResponse bookSeats(BookingRequest request) {
        return bookingService.bookSeats(request);
    }

    @Override
    public BaseResponseDTO cancelSelectedSeats(String bookingId) {
        return bookingService.cancelSelectedSeats(bookingId);
    }

    @Override
    public BookingSuccessResponse pay(UUID bookingId) {
        return bookingService.pay(bookingId);
    }

    @Override
    public List<MyBookingResponse> myBookings() {
        return bookingService.myBookings();
    }

    @Override
    public BookingDetails viewBooking(UUID bookingId) {
        return bookingService.viewBooking(bookingId);
    }

    @Override
    public AdminDashboardResponse getDashboard() {
        return bookingService.getDashboard();
    }

    @Override
    public CancelBookingResponse cancel(UUID bookingId) {
        return bookingService.cancel(bookingId);
    }
}
