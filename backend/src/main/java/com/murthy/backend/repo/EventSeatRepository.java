package com.murthy.backend.repo;

import com.murthy.backend.model.EventSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventSeatRepository extends JpaRepository<EventSeat, UUID> {
    @Query(value = """
select * from event_seats where event_id =:eventId and is_active=1
""", nativeQuery = true)
    List<EventSeat> findByEventId(@Param("eventId") String eventId);

    @Query(value = """
select * from event_seats where id in (:eventSeatIds) and is_active=1
""",nativeQuery = true)
    List<EventSeat> findAllByEventSeatIds(List<String> eventSeatIds);


    @Query(value = """
select exists(select 1 from event_seats where id in (:ids) and event_seat_status!= :status) 
""", nativeQuery = true)
    int anySeatUnavailable(@Param("ids") List<String> eventSeatIds, @Param("status") String status);

}
