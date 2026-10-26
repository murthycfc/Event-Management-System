package com.murthy.backend.repo;

import com.murthy.backend.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    @Query(value = """ 
select e.* from events e
           join venues v on e.venue_id=v.id
           join address a on v.address_id=a.id
           where e.is_Active=true
            and e.date>=CURRENT_DATE
            and (:name IS null or lower(e.name) like lower(concat('%', :name, '%')))
            and (:category is null or e.category=:category)
            and (:date is null or e.date =:date)
            and (:city is null or a.city=:city)
            and (:startingPrice is null or 
                            (select min(es.price) from event_seats es where es.event_id=e.id) <=:startingPrice)
""", countQuery = """
                    select count(*) from events e
           join venues v on e.venue_id=v.id
           join address a on v.address_id=a.id
           where e.is_Active=true
            and e.date>=CURRENT_DATE
            and (:name IS null or lower(e.name) like lower(concat('%', :name, '%')))
            and (:category is null or e.category=:category)
            and (:date is null or e.date =:date)
            and (:city is null or a.city=:city)
            and (:startingPrice is null or 
                            (select min(es.price) from event_seats es where es.event_id=e.id) <=:startingPrice)
                    """
            , nativeQuery = true)
    Page<Event> getEventsWithFilters(
            @Param("name") String name,
            @Param("category") String category,
            @Param("date") LocalDate date,
            @Param("city") String city,
            @Param("startingPrice") BigDecimal startingPrice, Pageable pageable);


    @Query(value = """
select * from events where id =:eventID and is_active=1
""", nativeQuery = true)
    Optional<Event> getEventById(@Param("eventID") String eventId);

    @Query(value = """
select count(*) from events where is_active=1
""", nativeQuery = true)
    long findEventsCount();

    @Query(value = """
select * from events where is_active=true
""",
            countQuery = "select count(*) from events where is_active=true",
            nativeQuery = true)
    Page<Event> findAllEvents(Pageable pageable);
}
