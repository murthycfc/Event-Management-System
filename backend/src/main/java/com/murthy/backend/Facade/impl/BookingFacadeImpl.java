package com.murthy.backend.Facade.impl;

import com.murthy.backend.Facade.api.BookingFacade;
import com.murthy.backend.dto.request.BookingRequest;
import com.murthy.backend.dto.response.*;
import com.murthy.backend.enums.BookingStatus;
import com.murthy.backend.exception.ResourceNotFoundException;
import com.murthy.backend.model.Booking;
import com.murthy.backend.repo.BookingRepository;
import com.murthy.backend.service.api.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingFacadeImpl implements BookingFacade {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

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

    @Override
    public Page<AdminBookingsListResponse> getBookings(BookingStatus status, Pageable pageable) {
        return bookingService.getBookings(status, pageable);
    }

    @Override
    public CancelBookingResponse cancelBookingByAdmin(String bookingId) {
        try {
            Booking booking = bookingRepository.findBookingById(bookingId).orElseThrow(()->{
                return new ResourceNotFoundException("Booking not found");
            });
            return bookingService.cancelBookingByAdmin(booking);
        } catch (ResourceNotFoundException e) {
            log.error("An error occurred in cancelBookingByAdmin {}", e.getMessage());
            throw e;
        }
    }
}
