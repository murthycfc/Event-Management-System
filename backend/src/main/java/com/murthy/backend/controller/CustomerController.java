package com.murthy.backend.controller;

import com.murthy.backend.Facade.api.BookingFacade;
import com.murthy.backend.Facade.api.EventFacade;
import com.murthy.backend.Facade.api.VenueFacade;
import com.murthy.backend.dto.request.BookingRequest;
import com.murthy.backend.dto.response.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RequestMapping("/api")
@RestController
@RequiredArgsConstructor
public class CustomerController {

    private final VenueFacade venueFacade;
    private final EventFacade eventFacade;
    private final BookingFacade bookingFacade;

//    @GetMapping("/venue/{venueId}/details")
//    public ResponseEntity<VenueResponse> getVenueDetails(@PathVariable UUID venueId){
//        return ResponseEntity.ok(venueFacade.getVenueDetails(venueId));
//    }

    @GetMapping("/events")
    public ResponseEntity<Page<EventResponse>> getEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal startingPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
            ){
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(eventFacade.getEvents(name, category, date, city, startingPrice, pageable));
    }

    @GetMapping("/events/{eventId}/details")
    public ResponseEntity<EventDetailsResponse> getEventDetails(@PathVariable UUID eventId){
        return ResponseEntity.ok(eventFacade.getEventDetails(eventId));
    }

    @GetMapping("/events/{eventId}/seats")
    public ResponseEntity<EventSeatsResponse> getEventSeats(@PathVariable UUID eventId){
        return ResponseEntity.ok(eventFacade.getEventSeats(eventId));
    }

    @PostMapping("/bookSeats")
    public ResponseEntity<BookingResponse> bookSeats(@RequestBody BookingRequest request){
        return ResponseEntity.ok(bookingFacade.bookSeats(request));
    }

    @PutMapping("/bookings/{bookingId}/cancelSelectedSeats")
    public ResponseEntity<BaseResponseDTO> cancelSelectedSeats(@PathVariable String bookingId){
        return ResponseEntity.ok(bookingFacade.cancelSelectedSeats(bookingId));
    }

    @PostMapping("/bookings/{bookingId}/pay")
    public ResponseEntity<BookingSuccessResponse> pay(@PathVariable UUID bookingId){
        return ResponseEntity.ok(bookingFacade.pay(bookingId));
    }

    @GetMapping("/myBookings")
    public ResponseEntity<List<MyBookingResponse>> myBookings(){
        return ResponseEntity.ok(bookingFacade.myBookings());
    }

    @GetMapping("/myBookings/{bookingId}/view")
    public ResponseEntity<BookingDetails> viewBooking(@PathVariable UUID bookingId){
        return ResponseEntity.ok(bookingFacade.viewBooking(bookingId));
    }

    @PutMapping("/myBookings/{bookingId}/cancel")
    public ResponseEntity<CancelBookingResponse> cancel(@PathVariable UUID bookingId){
        return ResponseEntity.ok(bookingFacade.cancel(bookingId));
    }

}
