package com.murthy.backend.repo;

import com.murthy.backend.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VenueRepository extends JpaRepository<Venue, UUID> {
    @Query(value = """
select exists(select 1 from venues where id=:venueId and is_active=1)
""", nativeQuery = true)
    int doesVenueExists(@Param("venueId") String venueId);

    @Query(value = """
select * from venues where id=:venueId and is_active=1
""", nativeQuery = true)
    Optional<Venue> findVenue(@Param("venueId") String venueId);

    @Query(value = """
select count(*) from venues where is_active=1
""", nativeQuery = true)
    long findVenuesCount();

    @Query(value = """
select * from venues where is_active=1
""", nativeQuery = true)
    List<Venue> findAllVenues();

    @Query(value = """
select * from venues where is_active=1 and name like concat('%', :name, '%')
""", nativeQuery = true)
    List<Venue> findVenuesByName(@Param("name") String name);
}
