package com.spring.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.spring.model.Accounts;
import com.spring.model.DentistProfile;

@Repository
public interface DentistProfileRepository extends JpaRepository<DentistProfile, Long> {
    List<DentistProfile> findAllByDeleteAtIsFalse();
    List<DentistProfile> findAllByDeleteAtIsTrue();
    Optional<DentistProfile> findByAccounts(Accounts accounts);


    @Query(value = "select * from dentist_profile dnt "
            + "ORDER BY(select count(bk.dentist_id) from booking bk where bk.dentist_id = dnt.id) desc "
            + "LIMIT ?1",nativeQuery = true)
    List<DentistProfile> findAllByTop (int top);
    
    DentistProfile findByAccountsId(Long accountId);
    
    @Query(value = "select * from reportAllDentist", nativeQuery = true)
    List<Map<String, Integer>> report();
    
    @Query(value="select * from sobenhnhankham",nativeQuery = true)
    List<Object[]> list();
    
}
