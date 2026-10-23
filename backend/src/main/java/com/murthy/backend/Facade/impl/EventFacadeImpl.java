package com.murthy.backend.Facade.impl;

import com.murthy.backend.Facade.api.EventFacade;
import com.murthy.backend.dto.request.BookingRequest;
import com.murthy.backend.dto.request.EventCreationRequest;
import com.murthy.backend.dto.request.EventUpdateRequest;
import com.murthy.backend.dto.response.*;
import com.murthy.backend.service.api.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EventFacadeImpl implements EventFacade {

    private final EventService eventService;
    @Override
    public BaseResponseDTO createEvent(EventCreationRequest request) {
        return eventService.createEvent(request);
    }

    @Override
    public Page<EventResponse> getEvents(String name, String category, LocalDate date, String city, BigDecimal startingPrice, Pageable pageable) {
        return eventService.getEvents(name, category, date, city, startingPrice, pageable);
    }

    @Override
    public EventDetailsResponse getEventDetails(UUID eventId) {
        return eventService.getEventDetails(eventId);
    }

    @Override
    public EventSeatsResponse getEventSeats(UUID eventId) {
        return eventService.getEventSeats(eventId);
    }

    @Override
    public List<AdminEventResponse> getAllEvents() {
        return eventService.getAllEvents();
    }

    @Override
    public AdminEventDetailsResponse getEventForEdit(String eventId) {
        return eventService.getEventForEdit(eventId);
    }

    @Override
    public BaseResponseDTO updateEvent(String eventId, EventUpdateRequest request) {
        return eventService.updateEvent(eventId, request);
    }

    @Override
    public BaseResponseDTO deleteEvent(String eventId) {
        return eventService.deleteEvent(eventId);
    }


}
