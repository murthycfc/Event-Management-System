package com.murthy.backend.service.api;

import com.murthy.backend.dto.request.VenueRequest;
import com.murthy.backend.dto.request.VenueUpdateRequest;
import com.murthy.backend.dto.response.*;
import com.murthy.backend.model.VenueSeat;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.UUID;

public interface VenueService {
    BaseResponseDTO createVenue(VenueRequest venueRequest);
    VenueResponse getVenueDetails(UUID venueId);
    Page<VenueListResponse> getVenues(String name, Pageable pageable);
    VenueDetailsResponse getVenueDetails(String venueId);
    BaseResponseDTO deleteVenue(String venueId);
    VenueEditResponse getVenueForEdit(String venueId);
    BaseResponseDTO updateVenue(String venueId, VenueUpdateRequest request);
    VenueDetailsPageResponse getVenueDetailsPageResponse(String venueId);
    BaseResponseDTO deactivateSeat(VenueSeat venueSeat);
    BaseResponseDTO activateSeat(VenueSeat venueSeat);
    List<VenueOptionResponse> getVenueOptions();
}
