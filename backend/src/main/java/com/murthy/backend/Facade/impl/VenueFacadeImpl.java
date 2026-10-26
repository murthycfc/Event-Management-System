package com.murthy.backend.Facade.impl;

import com.murthy.backend.Facade.api.VenueFacade;
import com.murthy.backend.dto.request.VenueRequest;
import com.murthy.backend.dto.request.VenueUpdateRequest;
import com.murthy.backend.dto.response.*;
import com.murthy.backend.exception.ResourceNotFoundException;
import com.murthy.backend.model.VenueSeat;
import com.murthy.backend.repo.VenueSeatRepository;
import com.murthy.backend.service.api.VenueService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Component
@Slf4j
public class VenueFacadeImpl implements VenueFacade {

    private final VenueService venueService;
    private final VenueSeatRepository venueSeatRepository;
    @Override
    public BaseResponseDTO createVenue(VenueRequest venueRequest) {
        return venueService.createVenue(venueRequest);
    }

    @Override
    public VenueResponse getVenueDetails(UUID venueId) {
        return venueService.getVenueDetails(venueId);
    }

    @Override
    public Page<VenueListResponse> getVenues(String name, Pageable pageable) {
        return venueService.getVenues(name, pageable);
    }

    @Override
    public VenueDetailsResponse getVenueDetails(String venueId) {
        return venueService.getVenueDetails(venueId);
    }

    @Override
    public BaseResponseDTO deleteVenue(String venueId) {
        return venueService.deleteVenue(venueId);
    }

    @Override
    public VenueEditResponse getVenueForEdit(String venueId) {
        return venueService.getVenueForEdit(venueId);
    }

    @Override
    public BaseResponseDTO updateVenue(String venueId, VenueUpdateRequest request) {
        return venueService.updateVenue(venueId, request);
    }

    @Override
    public VenueDetailsPageResponse getVenueDetailsPageResponse(String venueId) {
        return venueService.getVenueDetailsPageResponse(venueId);
    }

    @Override
    public BaseResponseDTO deactivateSeat(String seatId) {
        try {
            VenueSeat venueSeat = venueSeatRepository.findById(UUID.fromString(seatId)).orElseThrow(() -> {
                return new ResourceNotFoundException("Venue seat not found");
            });
            return venueService.deactivateSeat(venueSeat);
        }
        catch (ResourceNotFoundException e){
            log.error("An error occurred in deactivateSeat {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public BaseResponseDTO activateSeat(String seatId) {
        try {
            VenueSeat venueSeat = venueSeatRepository.findById(UUID.fromString(seatId)).orElseThrow(() -> {
                return new ResourceNotFoundException("Venue seat not found");
            });
            return venueService.activateSeat(venueSeat);
        }
        catch (ResourceNotFoundException e){
            log.error("An error occurred in activateSeat {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public List<VenueOptionResponse> getVenueOptions() {
        return venueService.getVenueOptions();
    }
}
