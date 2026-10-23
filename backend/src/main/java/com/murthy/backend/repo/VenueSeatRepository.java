package com.murthy.backend.repo;

import com.murthy.backend.model.VenueSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VenueSeatRepository extends JpaRepository<VenueSeat, UUID> {
    @Query(value = """
select * from venue_seats where venue_id =:venueId and is_active=1
""", nativeQuery = true)
    List<VenueSeat> getVenueSeatByVenueId(@Param("venueId") String venueID);
}
