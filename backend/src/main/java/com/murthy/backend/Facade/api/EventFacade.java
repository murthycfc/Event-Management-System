package com.murthy.backend.Facade.api;

import com.murthy.backend.dto.request.BookingRequest;
import com.murthy.backend.dto.request.EventCreationRequest;
import com.murthy.backend.dto.request.EventUpdateRequest;
import com.murthy.backend.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface EventFacade {
    BaseResponseDTO createEvent(EventCreationRequest request);
    Page<EventResponse> getEvents(String name, String category, LocalDate date, String city, BigDecimal startingPrice, Pageable pageable);
    EventDetailsResponse getEventDetails(UUID eventId);
    EventSeatsResponse getEventSeats(UUID eventId);
    List<AdminEventResponse> getAllEvents();
    AdminEventDetailsResponse getEventForEdit(String eventId);
    BaseResponseDTO updateEvent(String eventId, EventUpdateRequest request);
    BaseResponseDTO deleteEvent(String eventId);
}
