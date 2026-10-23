package com.murthy.backend.service.impl;

import com.murthy.backend.dto.request.BookingRequest;
import com.murthy.backend.dto.request.EventCreationRequest;
import com.murthy.backend.dto.request.EventUpdateRequest;
import com.murthy.backend.dto.request.SectionPriceRequest;
import com.murthy.backend.dto.response.*;
import com.murthy.backend.enums.BookingStatus;
import com.murthy.backend.enums.EventSeatStatus;
import com.murthy.backend.exception.BadRequestException;
import com.murthy.backend.exception.ResourceNotFoundException;
import com.murthy.backend.exception.SeatNotAvailableException;
import com.murthy.backend.model.*;
import com.murthy.backend.repo.*;
import com.murthy.backend.security.CustomUserPrincipal;
import com.murthy.backend.security.SecurityUtils;
import com.murthy.backend.service.api.EventService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final VenueSeatRepository venueSeatRepository;
    private final EventSeatRepository eventSeatRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;

    @Override
    public BaseResponseDTO createEvent(EventCreationRequest request) {
        try {
            Event event = new Event();
            BeanUtils.copyProperties(request, event);

            Venue venue = venueRepository.findVenue(request.getVenueId().toString())
                            .orElseThrow(()->{
                                log.error("Venue not found with id {} while creating event", request.getVenueId());
                                return new ResourceNotFoundException("Venue not found");
                            });
            event.setVenue(venue);

            //event seats

            List<EventSeat> eventSeats = new ArrayList<>();
            List<VenueSeat> venueSeats = venueSeatRepository.getVenueSeatByVenueId(venue.getId().toString());
            Map<String, SectionPriceRequest> eventSeatPrices = request.getEventSeatPrices();
            for(VenueSeat venueSeat : venueSeats) {
                EventSeat eventSeat = new EventSeat();
                eventSeat.setEvent(event);
                eventSeat.setVenueSeat(venueSeat);
                eventSeat.setPrice(eventSeatPrices.get(venueSeat.getSection()).getPrice());
                eventSeat.setEventSeatStatus(EventSeatStatus.AVAILABLE);
                eventSeats.add(eventSeat);
            }
            event.setEventSeats(eventSeats);
            eventRepository.save(event);
            return new BaseResponseDTO("Event created");
        }

        catch (ResourceNotFoundException e){
            throw e;
        }

        catch (Exception e) {
            log.error("An error occurred in createEvent method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public Page<EventResponse> getEvents(String name, String category, LocalDate date, String city, BigDecimal startingPrice, Pageable pageable) {
        try {
            Page<Event> events = eventRepository.getEventsWithFilters(name, category, date, city, startingPrice,pageable);
            if(events.isEmpty()){
                log.error("Events not found the requested filters");
                throw new ResourceNotFoundException("Events not found for the requested filters");
            }
            List<EventResponse> eventResponses = new ArrayList<>();

            for(Event event : events.getContent()){
                EventResponse eventResponse = new EventResponse();
                BeanUtils.copyProperties(event, eventResponse);

                //city
                eventResponse.setCity(event.getVenue().getAddress().getCity());

                //startingPrice
                List<EventSeat> eventSeats = eventSeatRepository.findByEventId(event.getId().toString());
                BigDecimal minimumPrice = null;
                for(EventSeat eventSeat : eventSeats){
                    if(minimumPrice == null ||  eventSeat.getPrice().compareTo(minimumPrice)<0){
                        minimumPrice = eventSeat.getPrice();
                    }
                }
                eventResponse.setStartingPrice(minimumPrice);
                eventResponses.add(eventResponse);
            }
            return new PageImpl<>(eventResponses, pageable, events.getTotalElements()) ;
        }
        catch (ResourceNotFoundException e){
            throw e;
        }
        catch (Exception e) {
            log.error("An error occurred in getEvents method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public EventDetailsResponse getEventDetails(UUID eventId) {
        try {
            Event event = eventRepository.getEventById(eventId.toString())
                    .orElseThrow(()->{
                        log.error("Event not found with id {}", eventId);
                        return new ResourceNotFoundException("Event not found");
                    });
            EventDetailsResponse eventDetailsResponse = new EventDetailsResponse();
            BeanUtils.copyProperties(event, eventDetailsResponse);

            Venue venue = venueRepository.findVenue(event.getVenue().getId().toString())
                    .orElseThrow(()->{
                        log.error("Venue not found with id {}", event.getVenue().getId());
                        return new ResourceNotFoundException("Venue not found");
                    });

            eventDetailsResponse.setVenueName(venue.getName());

            Address address = venue.getAddress();
            AddressResponse addressResponse = new AddressResponse();
            BeanUtils.copyProperties(address, addressResponse);
            eventDetailsResponse.setAddress(addressResponse);

            return eventDetailsResponse;
        }
        catch (ResourceNotFoundException e){
            throw e;
        }
        catch (Exception e) {
            log.error("An error occurred in getEventDetails method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public EventSeatsResponse getEventSeats(UUID eventId) {
        try {
            Event event = eventRepository.getEventById(eventId.toString())
                    .orElseThrow(()->{
                        log.error("Event not found with id {} while fetching seats", eventId);
                        return new ResourceNotFoundException("Event not found");
                    });
            List<EventSeat> eventSeats = eventSeatRepository.findByEventId(eventId.toString());

            if(eventSeats.isEmpty()){
                log.error("Event seats not found for the event with id {}", eventId);
                throw new ResourceNotFoundException("Event seats not found");
            }

            EventSeatsResponse eventSeatsResponse = new EventSeatsResponse();
            eventSeatsResponse.setEventId(eventId);
            eventSeatsResponse.setEventName(event.getName());
            eventSeatsResponse.setDate(event.getDate());
            eventSeatsResponse.setTime(event.getStartTime());
            eventSeatsResponse.setVenueName(event.getVenue().getName());
            List<EventSeatResponse> seats = new ArrayList<>();

            for(EventSeat eventSeat : eventSeats){

                VenueSeat venueSeat = eventSeat.getVenueSeat();

                EventSeatResponse eventSeatResponse = new EventSeatResponse();
                BeanUtils.copyProperties(venueSeat, eventSeatResponse);
                eventSeatResponse.setId(eventSeat.getId());
                eventSeatResponse.setPrice(eventSeat.getPrice());
                eventSeatResponse.setEventSeatStatus(eventSeat.getEventSeatStatus());


                seats.add(eventSeatResponse);
            }
            eventSeatsResponse.setEventSeats(seats);
            return eventSeatsResponse;
        }
        catch (ResourceNotFoundException ex){
            throw ex;
        }
        catch (Exception e) {
            log.error("An error occurred in getEventSeats method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public List<AdminEventResponse> getAllEvents() {
        try {
            List<Event> events = eventRepository.findAllEvents();
            if(events.isEmpty()){
                log.error("Events not found");
                throw new ResourceNotFoundException("No events found");
            }
            List<AdminEventResponse> responses = new ArrayList<>();
            for(Event event : events){
                AdminEventResponse adminEventResponse = new AdminEventResponse();
                BeanUtils.copyProperties(event, adminEventResponse);
                responses.add(adminEventResponse);
            }
            return responses;
        } catch (Exception e) {
            log.error("An error occurred in getAllEvents method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }

    }

    @Override
    public AdminEventDetailsResponse getEventForEdit(String eventId) {
        try {
            Event event = eventRepository.getEventById(eventId)
                    .orElseThrow(()->{
                        log.error("Event not found with id {} while fetching event for update", eventId);
                        return new ResourceNotFoundException("Event not found");
                    });
            AdminEventDetailsResponse adminEventDetailsResponse = new AdminEventDetailsResponse();
            BeanUtils.copyProperties(event, adminEventDetailsResponse);

            Venue venue = venueRepository.findVenue(event.getVenue().getId().toString())
                    .orElseThrow(()->{
                        log.error("Venue not found with id {} while updating event", event.getVenue().getId());
                        return new ResourceNotFoundException("Venue not found");
                    });
            adminEventDetailsResponse.setVenueId(venue.getId());
            adminEventDetailsResponse.setVenueName(venue.getName());

            Map<String, SectionPriceResponse> eventSeatPrices = new HashMap<>();
            for(EventSeat eventSeat : event.getEventSeats()){
                String section = eventSeat.getVenueSeat().getSection();
                if(!eventSeatPrices.containsKey(section)){
                    SectionPriceResponse sectionPriceResponse = new SectionPriceResponse();
                    sectionPriceResponse.setPrice(eventSeat.getPrice());
                    eventSeatPrices.put(section, sectionPriceResponse);
                }
            }
            adminEventDetailsResponse.setEventSeatPrices(eventSeatPrices);
            return adminEventDetailsResponse;
        }
        catch (ResourceNotFoundException e){
            throw e;
        }
        catch (Exception e) {
            log.error("An error occurred in getEventForEdit method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }

    }

    @Override
    @Transactional
    public BaseResponseDTO updateEvent(String eventId, EventUpdateRequest request) {
        try {
            Event event = eventRepository.getEventById(eventId)
                    .orElseThrow(()->{
                        log.error("Event not found with id {} while updating", eventId);
                        return new ResourceNotFoundException("Event not found");
                    });
            BeanUtils.copyProperties(request, event);
            for(EventSeat eventSeat : event.getEventSeats()){
                String section = eventSeat.getVenueSeat().getSection();
                SectionPriceRequest sectionPrice = request.getEventSeatPrices().get(section);
                if(sectionPrice!=null){
                    eventSeat.setPrice(sectionPrice.getPrice());
                }
            }
            eventRepository.save(event);
            log.info("Event updated");
            return new BaseResponseDTO("Event updated successfully");
        }
        catch (ResourceNotFoundException e){
            throw e;
        }
        catch (Exception e) {
            log.error("An error occurred in updateEvent method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public BaseResponseDTO deleteEvent(String eventId) {
        try {
            Event event = eventRepository.getEventById(eventId)
                    .orElseThrow(()->{
                        log.error("Event not found with id {} while deleting", eventId);
                        return new ResourceNotFoundException("Event not found");
                    });
            event.setActive(false);
            eventRepository.save(event);
            log.info("Event deleted");
            return new BaseResponseDTO("Event deleted successfully");
        }
        catch (ResourceNotFoundException e){
            throw e;
        }
        catch (Exception e) {
            log.error("An error occurred in deleteEvent method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }
}
