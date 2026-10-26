package com.murthy.backend.controller;

import com.murthy.backend.Facade.api.BookingFacade;
import com.murthy.backend.Facade.api.EventFacade;
import com.murthy.backend.Facade.api.VenueFacade;
import com.murthy.backend.dto.request.EventCreationRequest;
import com.murthy.backend.dto.request.EventUpdateRequest;
import com.murthy.backend.dto.request.VenueRequest;
import com.murthy.backend.dto.request.VenueUpdateRequest;
import com.murthy.backend.dto.response.*;
import com.murthy.backend.enums.BookingStatus;
import com.murthy.backend.model.VenueSeat;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final VenueFacade venueFacade;
    private final EventFacade eventFacade;
    private final BookingFacade bookingFacade;

    @PostMapping("/createVenue")
    public ResponseEntity<BaseResponseDTO> createVenue(@Valid @RequestBody VenueRequest venueRequest){
        return ResponseEntity.ok(venueFacade.createVenue(venueRequest));
    }

    @PostMapping("/createEvent")
    public ResponseEntity<BaseResponseDTO> createEvent(@RequestBody EventCreationRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(eventFacade.createEvent(request));
    }

    @GetMapping("/getDashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard(){
        return ResponseEntity.ok(bookingFacade.getDashboard());
    }

    @GetMapping("/getVenues")
    public ResponseEntity<Page<VenueListResponse>> getVenues(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size){
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(venueFacade.getVenues(name, pageable));
    }

    @GetMapping("/getAllEvents")
    public ResponseEntity<Page<AdminEventResponse>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size){
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(eventFacade.getAllEvents(pageable));
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<AdminEventDetailsResponse> getEventForEdit(@PathVariable String eventId){
        return ResponseEntity.ok(eventFacade.getEventForEdit(eventId));
    }

    @PutMapping("/events/{eventId}")
    public ResponseEntity<BaseResponseDTO> updateEvent(@PathVariable String eventId,
                                                       @RequestBody EventUpdateRequest request){
        return ResponseEntity.ok(eventFacade.updateEvent(eventId, request));
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<BaseResponseDTO> deleteEvent(@PathVariable String eventId){
        return ResponseEntity.ok(eventFacade.deleteEvent(eventId));
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<VenueDetailsResponse> getVenueDetails(@PathVariable String venueId){
        return ResponseEntity.ok(venueFacade.getVenueDetails(venueId));
    }

    @PutMapping("/venue/{venueId}/update")
    public ResponseEntity<BaseResponseDTO> updateVenue(@PathVariable String venueId, @Valid @RequestBody VenueUpdateRequest request){
        return ResponseEntity.ok(venueFacade.updateVenue(venueId,request));
    }

    @DeleteMapping("/venue/{venueId}")
    public ResponseEntity<BaseResponseDTO> deleteVenue(@PathVariable String venueId){
        return ResponseEntity.ok(venueFacade.deleteVenue(venueId));
    }

    @GetMapping("/venue/getVenueForEdit/{venueId}")
    public ResponseEntity<VenueEditResponse> getVenueForEdit(@PathVariable String venueId){
        return ResponseEntity.ok(venueFacade.getVenueForEdit(venueId));
    }

    @GetMapping("/venue/getVenueDetailsPage/{venueId}")
    public ResponseEntity<VenueDetailsPageResponse> getVenueDetailsPageResponse(@PathVariable String venueId){
        return ResponseEntity.ok(venueFacade.getVenueDetailsPageResponse(venueId));
    }

    @PatchMapping("/venueSeat/{venueSeatId}/deactivate")
    public ResponseEntity<BaseResponseDTO> deactivateSeat(@PathVariable String venueSeatId){
        return ResponseEntity.ok(venueFacade.deactivateSeat(venueSeatId));
    }

    @PatchMapping("/venueSeat/{venueSeatId}/activate")
    public ResponseEntity<BaseResponseDTO> activateSeat(@PathVariable String venueSeatId){
        return ResponseEntity.ok(venueFacade.activateSeat(venueSeatId));
    }

    @GetMapping("/getBookings")
    public ResponseEntity<Page<AdminBookingsListResponse>> getBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(defaultValue = "0")   int page,
            @RequestParam(defaultValue = "10") int size){

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(bookingFacade.getBookings(status, pageable));
    }

    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<BookingDetails> viewBooking(@PathVariable UUID bookingId){
        return ResponseEntity.ok(bookingFacade.viewBooking(bookingId));
    }

    @PutMapping("/bookings/{bookingId}")
    public ResponseEntity<CancelBookingResponse> cancelBookingByAdmin(@PathVariable String bookingId){
        return ResponseEntity.ok(bookingFacade.cancelBookingByAdmin(bookingId));
    }

    @GetMapping("/venue/{venueId}/details")
    public ResponseEntity<VenueResponse> getVenueDetails(@PathVariable UUID venueId){
        return ResponseEntity.ok(venueFacade.getVenueDetails(venueId));
    }

    @GetMapping("/venues/options")
    public ResponseEntity<List<VenueOptionResponse>> getVenueOptions(){
        return ResponseEntity.ok(venueFacade.getVenueOptions());
    }
}
