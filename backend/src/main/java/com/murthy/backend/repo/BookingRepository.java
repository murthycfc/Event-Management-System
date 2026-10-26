package com.murthy.backend.repo;

import com.murthy.backend.enums.BookingStatus;
import com.murthy.backend.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    @Query(value = """
select * from bookings where id =:bookingId and is_active=1
""", nativeQuery = true)
    Optional<Booking> findBookingById(@Param("bookingId") String bookingId);

    @Query(value = """
select * from bookings where 
                           user_id =:userId and 
                           booking_status not in ('ABANDONED', 'PENDING') and 
                           is_active=1
                            order by created_at desc 
""", nativeQuery = true)
    List<Booking> findBookingsByUser(@Param("userId") String userId);

    @Query(value = """
select booking_number from bookings order by booking_number desc limit 1
""", nativeQuery = true)
    Optional<Long> getLatestBookingNumber();

    @Query(value = """
select count(*) from bookings where booking_status not in ('ABANDONED') and is_active=true
""", nativeQuery = true)
    long findBookingsCount();

    @Query(value = """
select coalesce(sum(b.amount),0) - coalesce(sum(b.refunded_amount),0) from bookings b where b.booking_status in ('SUCCESSFUL', 'CANCELLED') and is_active=true
""", nativeQuery = true)
    BigDecimal findTotalRevenue();

    @Query(value = """
select * from bookings where (
                (:status is NULL AND booking_status in ('SUCCESSFUL', 'CANCELLED')) or booking_status = :status)
            AND is_deleted = false
            order BY created_at DESC
            """,
            countQuery = """
            SELECT COUNT(*) FROM bookings WHERE (
                (:status is NULL AND booking_status in ('SUCCESSFUL', 'CANCELLED')) or booking_status = :status)
            AND is_deleted = false
            """,
            nativeQuery = true
    )
    Page<Booking> findBookings(@Param("status") String status, Pageable pageable);
}
