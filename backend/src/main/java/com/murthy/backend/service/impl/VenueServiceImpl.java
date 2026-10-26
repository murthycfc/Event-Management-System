package com.murthy.backend.service.impl;

import com.murthy.backend.dto.request.*;
import com.murthy.backend.dto.response.*;
import com.murthy.backend.exception.BadRequestException;
import com.murthy.backend.exception.ResourceNotFoundException;
import com.murthy.backend.model.Address;
import com.murthy.backend.model.Venue;
import com.murthy.backend.model.VenueSeat;
import com.murthy.backend.repo.VenueRepository;
import com.murthy.backend.repo.VenueSeatRepository;
import com.murthy.backend.service.api.VenueService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;
    private final VenueSeatRepository venueSeatRepository;

    @Transactional
    @Override
    public BaseResponseDTO createVenue(VenueRequest venueRequest) {
        try {
            Set<Integer> rowNumbers = new HashSet<>();
            Set<String> sectionNames = new HashSet<>();
            for(VenueSectionRequest sectionRequest : venueRequest.getSections()){
                Set<String> rows = new HashSet<>();
                if(!sectionNames.add(sectionRequest.getSection())){
                    throw new BadRequestException("Section name already exists in this venue");
                }
                for(RowRequest rowRequest : sectionRequest.getRows()){
                    if(!rows.add(String.valueOf(rowRequest.getRow()))){
                        throw new BadRequestException("Row name already exists in this section");
                    }
                    if(!rowNumbers.add(rowRequest.getRowNumber())){
                        log.error("Row {} already exists ", rowRequest.getRowNumber());
                        throw new BadRequestException("Row number "+ rowRequest.getRowNumber()+ "already exists");
                    }
                }
            }
            Venue venue = new Venue();
            venue.setName(venueRequest.getName());

            Address address = new Address();
            BeanUtils.copyProperties(venueRequest.getAddress(), address);
            venue.setAddress(address);

            List<VenueSeat> venueSeatList = new ArrayList<>();
            for(VenueSectionRequest sectionRequest  : venueRequest.getSections()){
                for(RowRequest rowRequest : sectionRequest.getRows()){
                    for(int seatNumer = 1; seatNumer<=rowRequest.getRowCount(); seatNumer++) {
                        VenueSeat venueSeat = new VenueSeat();
                        venueSeat.setVenue(venue);
                        venueSeat.setSection(sectionRequest.getSection());
                        venueSeat.setRow(rowRequest.getRow());
                        venueSeat.setSeatNo(rowRequest.getRow().name() + seatNumer);
                        venueSeat.setXCoordinate(rowRequest.getRowNumber());
                        venueSeat.setYCoordinate(seatNumer);
                        venueSeatList.add(venueSeat);
                    }
                }
            }
            venue.setVenueSeats(venueSeatList);
            venueRepository.save(venue);
            log.info("Venue created successfully: {}", venue.getName());
            return new BaseResponseDTO("Venue created with seats");
        }
        catch (BadRequestException ex){
            throw ex;
        }
        catch (Exception e) {
            log.error("An error occurred in createVenue method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }
    @Override
    public VenueResponse getVenueDetails(UUID venueId) {
        try {
            Venue venue = venueRepository.findVenue(venueId.toString())
                    .orElseThrow(()->{
                        log.error("Venue not found with id {} while fetching venue details", venueId);
                        return new ResourceNotFoundException("Venue not found");
                    });

            VenueResponse venueResponse = new VenueResponse();
            venueResponse.setName(venue.getName());

            AddressResponse addressResponse = new AddressResponse();
            Address address = venue.getAddress();
            BeanUtils.copyProperties(address, addressResponse);
            venueResponse.setAddressResponse(addressResponse);

            Map<String, VenueSectionResponse> sectionMap = new LinkedHashMap<>();

            for(VenueSeat venueSeat : venue.getVenueSeats()){
                if(venueSeat.isActive()){
                    String sectionName = venueSeat.getSection();
                    VenueSectionResponse sectionResponse = sectionMap.get(sectionName);

                    if(sectionResponse == null){
                        sectionResponse = new VenueSectionResponse();
                        sectionResponse.setSection(sectionName);
                        sectionResponse.setSeats(new ArrayList<>());
                        sectionMap.put(sectionName, sectionResponse);
                    }

                    VenueSeatResponse venueSeatResponse = new VenueSeatResponse();
                    BeanUtils.copyProperties(venueSeat, venueSeatResponse);
                    sectionResponse.getSeats().add(venueSeatResponse);
                }

            }
            List<VenueSectionResponse> sections = new ArrayList<>(sectionMap.values());
            venueResponse.setSections(sections);
            return venueResponse;

        }
        catch (ResourceNotFoundException e){
            throw e;
        }
        catch (Exception e) {
            log.error("An error occurred in getVenueDetails method, {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }


    @Override
    public Page<VenueListResponse> getVenues(String name, Pageable pageable){

        try {
            Page<Venue> venues;
            if(name==null || name.isBlank()){
                venues = venueRepository.findAllVenues(pageable);
            }
            else{
                venues = venueRepository.findVenuesByName(name.trim(), pageable);
            }

            if(venues.isEmpty()){
                log.error("No venues are listed now");
                throw new ResourceNotFoundException("No venues found");
            }

            return venues.map(venue -> {
                VenueListResponse response = new VenueListResponse();
                response.setId(venue.getId());
                response.setName(venue.getName());
                response.setCity(venue.getAddress().getCity());
                response.setState(venue.getAddress().getState());
                response.setTotalSeats((int) venue.getVenueSeats().stream().filter(VenueSeat::isActive).count());
                long totalSections = venue.getVenueSeats()
                        .stream()
                        .filter(VenueSeat::isActive)
                        .map(VenueSeat::getSection)
                        .distinct()
                        .count();
                response.setTotalSections((int) totalSections);
                return response;
            });
        }
        catch (ResourceNotFoundException e){
            throw e;
        }
        catch (Exception e) {
            log.error("An error occurred in getVenues {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public VenueDetailsResponse getVenueDetails(String venueId) {
        try {
            Venue venue = venueRepository.findVenue(venueId)
                    .orElseThrow(()->{
                        log.error("Venue not found");
                        throw new ResourceNotFoundException("Venue not found");
                    });
            VenueDetailsResponse response = new VenueDetailsResponse();
            response.setId(venue.getId());
            response.setName(venue.getName());

            List<String> sections = new ArrayList<>();
            for(VenueSeat venueSeat : venue.getVenueSeats()){
                String section = venueSeat.getSection();
                if(!sections.contains(section)){
                    sections.add(section);
                }
            }
            response.setSections(sections);
            return response;

        }
        catch (ResourceNotFoundException e){
            throw e;
        }
        catch (Exception e) {
            log.error("An error occurred occurred in getVenueDetails {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }

    }

    @Override
    public BaseResponseDTO deleteVenue(String venueId) {
        try {
            Venue venue = venueRepository.findVenue(venueId)
                    .orElseThrow(()->{
                        throw new ResourceNotFoundException("Venue not found");
                    });
            if(!venue.isActive()){
                throw new BadRequestException("Venue already deleted");
            }

            venue.setActive(false);
            venueRepository.save(venue);
            log.info("Venue deleted successfully");
            return new BaseResponseDTO("Venue deleted successfully");
        }
        catch (ResourceNotFoundException | BadRequestException e){
            log.error("An error occurred in deleteVenue {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in deleteVenue {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public VenueEditResponse getVenueForEdit(String venueId) {
        try {
            Venue venue = venueRepository.findVenue(venueId)
                    .orElseThrow(()-> new ResourceNotFoundException("Venue not found"));
            VenueEditResponse response = new VenueEditResponse();
            BeanUtils.copyProperties(venue, response);

            AddressResponse addressResponse = new AddressResponse();
            BeanUtils.copyProperties(venue.getAddress(), addressResponse);
            response.setAddressResponse(addressResponse);

            List<VenueSectionResponse> sections = new ArrayList<>();

            for(VenueSeat venueSeat : venue.getVenueSeats()){
                if(venueSeat.isDeleted()) {
                    continue;
                }

                String sectionName = venueSeat.getSection();
                VenueSectionResponse sectionResponse = null;
                for(VenueSectionResponse section : sections){
                    if(section.getSection().equals(sectionName)){
                        sectionResponse = section;
                        break;
                    }
                }

                if(sectionResponse==null){
                    sectionResponse = new VenueSectionResponse();
                    sectionResponse.setSection(sectionName);
                    sectionResponse.setSeats(new ArrayList<>());

                    sections.add(sectionResponse);
                }

                VenueSeatResponse seatResponse = new VenueSeatResponse();
                BeanUtils.copyProperties(venueSeat, seatResponse);
                sectionResponse.getSeats().add(seatResponse);
            }
            response.setSections(sections);
            return response;

        }
        catch (ResourceNotFoundException e){
            log.error("An error occurred in updateVenue {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in updateVenue {}", e.getMessage());
            throw new RuntimeException(e);
        }

    }

    @Override
    public VenueDetailsPageResponse getVenueDetailsPageResponse(String venueId) {
        try {
            Venue venue = venueRepository.findVenue(venueId)
                    .orElseThrow(()-> new ResourceNotFoundException("Venue not found"));
            VenueDetailsPageResponse response = new VenueDetailsPageResponse();
            BeanUtils.copyProperties(venue, response);
            AddressResponse addressResponse = new AddressResponse();
            BeanUtils.copyProperties(venue.getAddress(),addressResponse);
            response.setAddressResponse(addressResponse);

            Map<String, Integer> sectionSeatCounts = new HashMap<>();
            int totalSeats = 0;
            for(VenueSeat seat : venue.getVenueSeats()){
                if (!seat.isActive()) {
                    continue;
                }
                totalSeats++;
                String section = seat.getSection();

                if(sectionSeatCounts.containsKey(section)){
                    int count = sectionSeatCounts.get(section);
                    sectionSeatCounts.put(section, count+1);
                }
                else {
                    sectionSeatCounts.put(section,1);
                }
            }
            response.setTotalSeats(totalSeats);
            response.setTotalSections(sectionSeatCounts.size());
            response.setSectionSeatCounts(sectionSeatCounts);
            return response;
        }
        catch (ResourceNotFoundException e){
            log.error("An error occurred in getVenueDetailsPageResponse {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in getVenueDetailsPageResponse {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public BaseResponseDTO deactivateSeat(VenueSeat venueSeat) {
        try {

            if (venueSeat.isDeleted()) {
                throw new BadRequestException("Venue seat was deleted");
            }
            venueSeat.setActive(false);
            venueSeatRepository.save(venueSeat);
            return new BaseResponseDTO("Venue seat updated successfully");
        } catch ( BadRequestException e) {
            log.error("An errored occurred in deactivateSeat {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("An unexpected error occurred in deactivateSeat {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public BaseResponseDTO activateSeat(VenueSeat venueSeat) {
        try {
            if (venueSeat.isDeleted()) {
                throw new BadRequestException("Venue seat was deleted");
            }
            venueSeat.setActive(true);
            venueSeatRepository.save(venueSeat);
            return new BaseResponseDTO("Venue seat updated successfully");
        } catch ( BadRequestException e) {
            log.error("An errored occurred in activateSeat {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("An unexpected error occurred in activateSeat {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public List<VenueOptionResponse> getVenueOptions() {
        try {
            List<Venue> venues = venueRepository.findVenues();
            List<VenueOptionResponse> responses = new ArrayList<>();
            for(Venue venue : venues){
                VenueOptionResponse response = new VenueOptionResponse();
                BeanUtils.copyProperties(venue, response);
                responses.add(response);
            }
            return responses;
        } catch (Exception e) {
            log.error("An unexpected error occurred in getVenueOptions {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    @Transactional
    public BaseResponseDTO updateVenue(String venueId, VenueUpdateRequest request) {
        try {
            Venue venue = venueRepository.findVenue(venueId)
                    .orElseThrow(()-> new ResourceNotFoundException("Venue not found"));
            venue.setName(request.getName());

            Address address = venue.getAddress();
            AddressUpdateRequest addressUpdateRequest = request.getAddress();
            BeanUtils.copyProperties(addressUpdateRequest, address);
            venue.setAddress(address);

            updateExistingSections(venue, request.getExistingSections());
            createNewSections(venue, request.getNewSections());


            venueRepository.save(venue);
            return new BaseResponseDTO("Venue updated successfully");

        }
        catch (ResourceNotFoundException e){
            log.error("An error occurred while updating venue {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }

    }

    private void createNewSections(Venue venue, @Valid List<VenueSectionRequest> newSections) {
        if (newSections == null || newSections.isEmpty()) {
            return;
        }
        Set<String> existingSectionNames = new HashSet<>();
        for (VenueSeat seat : venue.getVenueSeats()) {
            if (!seat.isDeleted()) {
                existingSectionNames.add(seat.getSection());
            }
        }

        Set<String> newSectionNames = new HashSet<>();

        for (VenueSectionRequest sectionRequest : newSections){
            String sectionName = sectionRequest.getSection();
            if (!newSectionNames.add(sectionName)) {
                log.error("Section {} already exists in request", sectionName);
                throw new BadRequestException("Section " + sectionName + " already exists");
            }

            if (existingSectionNames.contains(sectionName)) {
                log.error("Section {} already exists in venue", sectionName);
                throw new BadRequestException("Section " + sectionName + " already exists");
            }
        }

        Set<Integer> rowNumbers = new HashSet<>();
        for (VenueSeat seat : venue.getVenueSeats()) {
            if (!seat.isDeleted()) {
                rowNumbers.add(seat.getXCoordinate());
            }
        }

        for (VenueSectionRequest sectionRequest : newSections){
            for (RowRequest rowRequest : sectionRequest.getRows()){
                if (!rowNumbers.add(rowRequest.getRowNumber())) {
                    log.error("Row {} already exists", rowRequest.getRowNumber());
                    throw new BadRequestException("Row number " + rowRequest.getRowNumber() + " already exists");
                }
            }
        }

        for (VenueSectionRequest sectionRequest : newSections){
            for (RowRequest rowRequest : sectionRequest.getRows()){
                for (int seatNumber = 1; seatNumber <= rowRequest.getRowCount(); seatNumber++){
                    VenueSeat venueSeat = new VenueSeat();
                    venueSeat.setVenue(venue);
                    venueSeat.setSection(sectionRequest.getSection());
                    venueSeat.setRow(rowRequest.getRow());
                    venueSeat.setSeatNo(rowRequest.getRow().name() + seatNumber);
                    venueSeat.setXCoordinate(rowRequest.getRowNumber());
                    venueSeat.setYCoordinate(seatNumber);
                    venue.getVenueSeats().add(venueSeat);
                }
            }
        }

    }

    private void updateExistingSections(Venue venue, List<VenueSectionUpdateRequest> requestedSections) {

        if (requestedSections == null || requestedSections.isEmpty()) {
            return;
        }

        List<VenueSeat> existingSeats = venue.getVenueSeats()
                .stream()
                .filter(seat -> !seat.isDeleted())
                .toList();
//        Map<UUID, VenueSeat> existingSeatMap = new HashMap<>();
//
//        for(VenueSeat seat : existingSeats){
//            existingSeatMap.put(seat.getId(), seat);
//        }

        Set<String> occupiedCoordinates = new HashSet<>();
        for (VenueSeat seat : existingSeats){
            String coordinate = seat.getXCoordinate() + ":" + seat.getYCoordinate();
            occupiedCoordinates.add(coordinate);
        }
        for(VenueSectionUpdateRequest venueSectionUpdateRequest : requestedSections){
            Set<String> seatNos = new HashSet<>();
            for(VenueSeatUpdateRequest seatRequest : venueSectionUpdateRequest.getSeats()){
                if(seatRequest.getId()==null){
                    String coordinate = seatRequest.getXCoordinate() + ":" + seatRequest.getYCoordinate();
                    if(!occupiedCoordinates.add(coordinate)){
                        throw new BadRequestException("Requested coordinates already exists");
                    }
                }
                if(!seatNos.add(seatRequest.getSeatNo())){
                    throw new BadRequestException("A seat number already exists in this section");
                }
            }
        }

        for(VenueSectionUpdateRequest sectionRequest : requestedSections){
            String sectionName = sectionRequest.getSection();
//            if (sectionName == null || sectionName.isBlank()) {
//                throw new BadRequestException("Section name cannot be empty");
//            }

//            if(!sectionNames.add(sectionName)){
//                throw new BadRequestException("Duplicate section: " + sectionName);
//            }

//            if(sectionRequest.getSeats()==null){
//                //exception
//                continue;
//            }
            for(VenueSeatUpdateRequest seatRequest : sectionRequest.getSeats()){
                // Existing seat
//                if(seatRequest.getId()!=null){
//                    VenueSeat seat = existingSeatMap.get(seatRequest.getId());
//                    String coordinate =
//                            seatRequest.getXCoordinate() + ":" + seatRequest.getYCoordinate();
//
//                    if (seat == null) {
//                        throw new ResourceNotFoundException("Venue seat not found");
//                    }
//
//                    requestedSeatIds.add(seat.getId());
//
//                    seat.setSection(sectionName);
//                    seat.setRow(seatRequest.getRow());
//                    seat.setSeatNo(seatRequest.getSeatNo());
//                    seat.setXCoordinate(seatRequest.getXCoordinate());
//                    seat.setYCoordinate(seatRequest.getYCoordinate());
//                }
                //new seat
                if(seatRequest.getId()==null){
                    VenueSeat newSeat = new VenueSeat();
                    newSeat.setVenue(venue);
                    newSeat.setSection(sectionName);
                    newSeat.setRow(seatRequest.getRow());
                    newSeat.setSeatNo(seatRequest.getSeatNo());
                    newSeat.setXCoordinate(seatRequest.getXCoordinate());
                    newSeat.setYCoordinate(seatRequest.getYCoordinate());

                    venue.getVenueSeats().add(newSeat);
                }
            }
        }
        //soft delete
//        for(VenueSeat existingSeat : existingSeats){
//
//            if (!sectionNames.contains(existingSeat.getSection())) {
//                continue;
//            }
//            if(!requestedSeatIds.contains(existingSeat.getId())){
//                existingSeat.setActive(false);
//            }
//        }
    }
}
