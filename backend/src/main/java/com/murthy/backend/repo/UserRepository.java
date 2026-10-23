package com.murthy.backend.repo;

import com.murthy.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    @Query(value = """
select * from users where email =:email and is_Active=1
""", nativeQuery = true)
    Optional<User> findEmail(@Param("email") String email);

    @Query(value = """
select exists(select 1 from users where email =:email)
""", nativeQuery = true)
    int existsEmail(@Param("email") String email);
}
