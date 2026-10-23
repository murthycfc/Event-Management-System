package com.murthy.backend.repo;

import com.murthy.backend.model.BookingSeats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeats, UUID> {
}
