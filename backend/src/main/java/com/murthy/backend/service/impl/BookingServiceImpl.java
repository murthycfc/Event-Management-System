package com.murthy.backend.service.impl;

import com.murthy.backend.dto.request.BookingRequest;
import com.murthy.backend.dto.response.*;
import com.murthy.backend.enums.BookingStatus;
import com.murthy.backend.enums.EventSeatStatus;
import com.murthy.backend.exception.DuplicatePaymentException;
import com.murthy.backend.exception.ResourceNotFoundException;
import com.murthy.backend.exception.SeatNotAvailableException;
import com.murthy.backend.model.*;
import com.murthy.backend.repo.*;
import com.murthy.backend.security.SecurityUtils;
import com.murthy.backend.service.api.BookingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.apache.coyote.BadRequestException;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.BeanUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import com.murthy.backend.exception.BadRequestException;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final EventSeatRepository eventSeatRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;

    @Override
    @Transactional
    public BookingResponse bookSeats(BookingRequest request) {
        try {
            List<String> eventSeatIds = request.getEventSeatIds()
                    .stream()
                    .map(UUID::toString)
                    .toList();

            List<EventSeat> requestedSeats = eventSeatRepository.findAllByEventSeatIds(eventSeatIds);

            if(eventSeatIds.size()!=requestedSeats.size()){
                log.error("Few seats not found while booking seats of {}", eventSeatIds);
                throw new ResourceNotFoundException("Few seats not found");
            }

            Event event = requestedSeats.get(0).getEvent();

            boolean allEventSeatsBelongToSameEvent = requestedSeats.stream()
                    .allMatch(seat -> seat.getEvent().getId().equals(event.getId()));

            if(!allEventSeatsBelongToSameEvent){
                log.error("All seats {} not belong to same event", requestedSeats);
                throw new IllegalArgumentException("All seats must belong to same event");
            }

            LocalDateTime eventEndTime = LocalDateTime.of(event.getDate(), event.getEndTime());
            if(LocalDateTime.now().isAfter(eventEndTime)){
                throw new BadRequestException("Cannot book seats for a past event");
            }

            //boolean anySeatsUnavailable
            if(eventSeatRepository.anySeatUnavailable(eventSeatIds, EventSeatStatus.AVAILABLE.name())==1){
                log.error("Combination of seats with ids {} are not available right now", eventSeatIds);
                throw new SeatNotAvailableException("A seat not available");
            }

            BigDecimal totalAmount = BigDecimal.ZERO;
            List<BookedSeatDetails> seatDetails = new ArrayList<>();
            List<EventSeat> seatsToUpdate = new ArrayList<>();

            for(EventSeat eventSeat : requestedSeats){

                BookedSeatDetails bookedSeatDetails = new BookedSeatDetails();
                bookedSeatDetails.setSection(eventSeat.getVenueSeat().getSection());
                bookedSeatDetails.setSeatNo(eventSeat.getVenueSeat().getSeatNo());
                seatDetails.add(bookedSeatDetails);

                eventSeat.setEventSeatStatus(EventSeatStatus.PENDING);
                seatsToUpdate.add(eventSeat);
                totalAmount = totalAmount.add(eventSeat.getPrice());
            }
            eventSeatRepository.saveAll(seatsToUpdate);

            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();

            Booking booking = new Booking();
            booking.setUser(currentUser);
            booking.setAmount(totalAmount);
            booking.setBookingStatus(BookingStatus.PENDING);
            booking.setBookingNumber(generateBookingNumber());
            booking.setRefundedAmount(BigDecimal.ZERO);
            booking.setCancellationFee(BigDecimal.ZERO);
            bookingRepository.save(booking);

            List<BookingSeats> bookingSeats = new ArrayList<>();


            for(EventSeat eventSeat : requestedSeats){
                BookingSeats bookingSeat = new BookingSeats();
                bookingSeat.setBooking(booking);
                bookingSeat.setEventSeat(eventSeat);
                bookingSeat.setPrice(eventSeat.getPrice());
                bookingSeats.add(bookingSeat);

                seatsToUpdate.add(eventSeat);
            }

            bookingSeatRepository.saveAll(bookingSeats);

            BookingResponse bookingResponse = new BookingResponse();
            bookingResponse.setBookingId(booking.getId());
            bookingResponse.setEventName(event.getName());
            bookingResponse.setSeatDetails(seatDetails);
            bookingResponse.setTotalAmount(totalAmount);
            bookingResponse.setBookingStatus(BookingStatus.PENDING);

            return bookingResponse;
        }
        catch (ResourceNotFoundException | IllegalArgumentException | SeatNotAvailableException e){
            throw e;
        }
        catch (Exception e) {
            log.error("An error occurred in bookSeats method, {}", e.getMessage());
            throw new BadRequestException(e.getLocalizedMessage());
        }
    }

    @Override
    @Transactional
    public BaseResponseDTO cancelSelectedSeats(String bookingId) {
        try {
            Booking booking = bookingRepository.findBookingById(bookingId)
                    .orElseThrow(()->{
                        log.error("Booking id {} not found while cancelling selected seats ", bookingId);
                        return new ResourceNotFoundException("Booking id not found");
                    });
            if (booking.getBookingStatus() != BookingStatus.PENDING) {
                log.error("Cannot release seats whose booking status not pending");
                throw new BadRequestException("This booking cannot be cancelled");
            }
            List<BookingSeats> bookingSeats = booking.getBookingSeats();

            if(bookingSeats == null || bookingSeats.isEmpty()){
                log.error("No seats for this booking id {} while cancelling selected seats", bookingId);
                throw new BadRequestException("No seats for this booking");
            }

            if(!booking.getUser().getId().equals(SecurityUtils.getCurrentUserId())){
                log.error("{} can't cancel selected seats for this booking {}. ", SecurityUtils.getCurrentUserId(), bookingId);
                throw new AccessDeniedException("Only the booking owner can cancel this booking");
            }

            List<EventSeat> seatsToUpdate = new ArrayList<>();
            for(BookingSeats bookingSeat : bookingSeats){
                EventSeat eventSeat = bookingSeat.getEventSeat();
                if(eventSeat.getEventSeatStatus()!= EventSeatStatus.PENDING){
                    log.error("seat with id {} already paid or not selected. So can't release now", eventSeat.getId());
                    throw new SeatNotAvailableException("A seat not selected or already paid");
                }
                eventSeat.setEventSeatStatus(EventSeatStatus.AVAILABLE);
                seatsToUpdate.add(eventSeat);
            }
            eventSeatRepository.saveAll(seatsToUpdate);

            booking.setBookingStatus(BookingStatus.ABANDONED);
            bookingRepository.save(booking);

            return new BaseResponseDTO("Seats released");
        }
        catch (SeatNotAvailableException | ResourceNotFoundException | AccessDeniedException ex){
            throw ex;
        }
        catch (Exception e) {
            log.error("An error occurred in cancelSelectedSeats method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }


    @Override
    @Transactional
    public BookingSuccessResponse pay(UUID bookingId) {
        try {
            Booking booking = bookingRepository.findBookingById(bookingId.toString())
                    .orElseThrow(()->{
                        log.error("Booking id {} not found while paying", bookingId);
                        return new ResourceNotFoundException("Booking id not found");
                    });
            if(booking.getBookingStatus()== BookingStatus.SUCCESSFUL){
                log.error("payment for the booking {} already paid", bookingId);
                throw new DuplicatePaymentException("Payment already done");
            }

            List<BookingSeats> bookingSeats = booking.getBookingSeats();

            if(bookingSeats == null || bookingSeats.isEmpty()){
                log.error("No seats for this booking id {}", bookingId);
                throw new BadRequestException("No seats for this booking");
            }

            if(!booking.getUser().getId().equals(SecurityUtils.getCurrentUserId())){
                log.error("{} can't pay for this booking {}. ", SecurityUtils.getCurrentUserId(), bookingId);
                throw new AccessDeniedException("Only the booking owner can pay his only payments");
            }

            List<EventSeat> seatsToUpdate = new ArrayList<>();
            for(BookingSeats bookingSeat : bookingSeats){
                EventSeat eventSeat = bookingSeat.getEventSeat();
                if(eventSeat.getEventSeatStatus()== EventSeatStatus.BOOKED){
                    log.error("seat with id {} not available right now", eventSeat.getId());
                    throw new SeatNotAvailableException("A seat not available");
                }
                eventSeat.setEventSeatStatus(EventSeatStatus.BOOKED);
                seatsToUpdate.add(eventSeat);
            }
            eventSeatRepository.saveAll(seatsToUpdate);

            booking.setBookingStatus(BookingStatus.SUCCESSFUL);
            bookingRepository.save(booking);

            Address address = bookingSeats.get(0).getEventSeat().getVenueSeat().getVenue().getAddress();
            AddressResponse addressResponse = new AddressResponse();
            BeanUtils.copyProperties(address, addressResponse);

            List<BookedSeatDetails> seatDetails = new ArrayList<>();

            for(BookingSeats bookingSeat :  bookingSeats){
                BookedSeatDetails bookedSeatDetails = new BookedSeatDetails();
                bookedSeatDetails.setSection(bookingSeat.getEventSeat().getVenueSeat().getSection());
                bookedSeatDetails.setSeatNo(bookingSeat.getEventSeat().getVenueSeat().getSeatNo());
                seatDetails.add(bookedSeatDetails);
            }


            BookingSuccessResponse bookingSuccessResponse = new BookingSuccessResponse();
            bookingSuccessResponse.setBookingId(bookingId);
            bookingSuccessResponse.setEventName(bookingSeats.get(0).getEventSeat().getEvent().getName());
            bookingSuccessResponse.setSeatDetails(seatDetails);
            bookingSuccessResponse.setBookingStatus(booking.getBookingStatus());
            bookingSuccessResponse.setTotalAmount(booking.getAmount());
            bookingSuccessResponse.setAddressResponse(addressResponse);
            bookingSuccessResponse.setBookingNumber(booking.getBookingNumber());
            log.info("Payment success");
            return bookingSuccessResponse;
        }
        catch (DuplicatePaymentException | SeatNotAvailableException | ResourceNotFoundException | AccessDeniedException ex){
            throw ex;
        }
        catch (Exception e) {
            log.error("An error occurred in pay method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public List<MyBookingResponse> myBookings() {
        try {
            List<Booking> bookings = bookingRepository.findBookingsByUser(SecurityUtils.getCurrentUserId().toString());
            if(bookings.isEmpty()){
                log.error("No bookings for this user {}", SecurityUtils.getCurrentUserId());
                throw new ResourceNotFoundException("No Bookings found");
            }

//            Event event = bookings.get(0).getBookingSeats().get(0).getEventSeat().getEvent();

            List<MyBookingResponse> myBookings = new ArrayList<>();
            for(Booking booking : bookings){
                MyBookingResponse myBookingResponse = new MyBookingResponse();
                BeanUtils.copyProperties(booking, myBookingResponse);
                myBookingResponse.setBookingId(booking.getId());

                Event event = booking.getBookingSeats().get(0).getEventSeat().getEvent();
                myBookingResponse.setEventName(event.getName());
                myBookingResponse.setEventDate(event.getDate());
                myBookingResponse.setStartTime(event.getStartTime());
                myBookingResponse.setVenueName(event.getVenue().getName());
                myBookingResponse.setCity(event.getVenue().getAddress().getCity());
                myBookingResponse.setTotalAmount(booking.getAmount());

                myBookings.add(myBookingResponse);
            }

            return myBookings;
        }
        catch (ResourceNotFoundException e){
            throw e;
        }
        catch (Exception e) {
            log.error("An error occurred in myBookings method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public BookingDetails viewBooking(UUID bookingId) {
        try {
            Booking booking = bookingRepository.findBookingById(bookingId.toString())
                    .orElseThrow(()->{
                        log.error("Booking not found with id {} while viewing booking details ", bookingId);
                        return new ResourceNotFoundException("Booking not found");
                    });

            if(!booking.getUser().getId().equals(SecurityUtils.getCurrentUserId())){
                log.error("{} can't access others bookings", SecurityUtils.getCurrentUserId());
                throw new AccessDeniedException("You don't have access");
            }

            BookingDetails bookingDetails = new BookingDetails();
            BeanUtils.copyProperties(booking, bookingDetails);

            Event event = booking.getBookingSeats().get(0).getEventSeat().getEvent();
            Venue venue = event.getVenue();

            BeanUtils.copyProperties(event, bookingDetails, "id", "createdAt", "updatedAt", "isActive");
            bookingDetails.setEventName(event.getName());

            bookingDetails.setVenueName(venue.getName());

            AddressResponse addressResponse = new AddressResponse();
            BeanUtils.copyProperties(venue.getAddress(), addressResponse);
            bookingDetails.setAddressResponse(addressResponse);

            List<BookedSeatDetails> seatDetails = new ArrayList<>();
            List<BookingSeats> bookingSeats = booking.getBookingSeats();
            for(BookingSeats seat : bookingSeats){
                BookedSeatDetails bookedSeatDetails = new BookedSeatDetails();
                bookedSeatDetails.setSection(seat.getEventSeat().getVenueSeat().getSection());
                bookedSeatDetails.setSeatNo(seat.getEventSeat().getVenueSeat().getSeatNo());
                seatDetails.add(bookedSeatDetails);
            }
            bookingDetails.setSeatDetails(seatDetails);

            bookingDetails.setTotalAmount(booking.getAmount());

            return bookingDetails;
        }
        catch (ResourceNotFoundException | AccessDeniedException e){
            throw e;
        }
        catch (Exception e) {
            log.error("An error occurred in viewBooking method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    @Transactional
    public CancelBookingResponse cancel(UUID bookingId) {
        try {
            Booking booking = bookingRepository.findBookingById(bookingId.toString())
                    .orElseThrow(()->{
                        log.error("Booking not found with id {} while cancellation", bookingId);
                        return new ResourceNotFoundException("Booking not found");
                    });

            if(!booking.getUser().getId().equals(SecurityUtils.getCurrentUserId())){
                log.error("Unauthorized person attempted to cancel the booking with id {}", bookingId);
                throw new AccessDeniedException("You can't cancel other's bookings");
            }

            if(booking.getBookingStatus()==BookingStatus.CANCELLED){
                log.error("booking id {} already cancelled", bookingId);
                throw new BadRequestException("This booking already cancelled");
            }

            //


            Event event = booking.getBookingSeats().get(0).getEventSeat().getEvent();
            LocalDateTime eventDateTime = LocalDateTime.of(event.getDate(), event.getStartTime());
            long remainingHours = Duration.between(LocalDateTime.now(), eventDateTime).toHours();

            if(remainingHours<0){
                log.error("past events can't be cancelled with booking id {}", bookingId);
                throw new BadRequestException("Completed events can't be cancelled");
            }

            if(remainingHours<12){
                log.error("Cancellation not allowed less than 12 hours before the event");
                throw new BadRequestException("Cancellation not allowed less than 12 hours before the event");
            }

            BigDecimal paidAmount = booking.getAmount();
            BigDecimal refundedAmount = BigDecimal.ZERO;
            int refundPercentage = 0;
            if(remainingHours>=48){
                refundPercentage = 100;
                refundedAmount = paidAmount;
            } else if (remainingHours>=24) {
                refundPercentage = 50;
                refundedAmount = paidAmount.multiply(new BigDecimal("0.5"));
            }
            else if(remainingHours>=12) {
                refundPercentage = 25;
                refundedAmount = paidAmount.multiply(new BigDecimal("0.25"));
            }
            BigDecimal cancellationFee = paidAmount.subtract(refundedAmount);

            List<EventSeat> seatsToRelease = new ArrayList<>();
            for(BookingSeats seat : booking.getBookingSeats()){
                EventSeat eventSeat = seat.getEventSeat();
                eventSeat.setEventSeatStatus(EventSeatStatus.AVAILABLE);
                seatsToRelease.add(eventSeat);
            }
            eventSeatRepository.saveAll(seatsToRelease);

            booking.setBookingStatus(BookingStatus.CANCELLED);
            booking.setRefundedAmount(refundedAmount);
            booking.setCancellationFee(cancellationFee);
            bookingRepository.save(booking);

            CancelBookingResponse response = new CancelBookingResponse();
            response.setBookingId(bookingId);
            response.setEventName(event.getName());
            response.setPaidAmount(paidAmount);
            response.setRefundPercentage(refundPercentage);
            response.setCancellationFee(cancellationFee);
            response.setRefundedAmount(refundedAmount);
            response.setBookingStatus(booking.getBookingStatus());

            log.info("Booking cancelled");

            return response;
        }
        catch (ResourceNotFoundException | BadRequestException ex){
            throw ex;
        }
        catch (Exception e) {
            log.error("An error occurred in cancel method  {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }

    }

    @Override
    public AdminDashboardResponse getDashboard(){
        long totalEvents = eventRepository.findEventsCount();
        long totalVenues = venueRepository.findVenuesCount();
        long totalBookings = bookingRepository.findBookingsCount();
        BigDecimal totalRevenue = bookingRepository.findTotalRevenue();
        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setTotalEvents(totalEvents);
        response.setTotalVenues(totalVenues);
        response.setTotalBookings(totalBookings);
        response.setTotalRevenue(totalRevenue);
        return response;
    }


    private @NonNull Long generateBookingNumber(){
        try {
            Optional<Long> lastBookingNumber = bookingRepository.getLatestBookingNumber();

            return lastBookingNumber.map(aLong -> aLong + 1).orElse(1000000L);

        } catch (Exception e) {
            log.error("Failed to generate booking number");
            throw new BadRequestException(e.getMessage());
        }
    }
}
