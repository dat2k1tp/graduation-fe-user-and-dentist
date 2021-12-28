package com.spring.service.communes;

import com.spring.dto.model.CommunesDTO;
import com.spring.exception.NotFoundException;
import com.spring.exception.NotParsableContentException;
import com.spring.repository.CommunesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommunesServicesImpl implements CommunesServices {
	private CommunesRepository communesRepository;

	@Autowired
	public CommunesServicesImpl(CommunesRepository communesRepository) {
		this.communesRepository = communesRepository;
	}

	@Override
	public List<CommunesDTO> findAll() {
		List<CommunesDTO> itemsDTO = new ArrayList<>();
		this.communesRepository.findAll().stream().forEach(t -> itemsDTO.add(t.convertEntityToDTO()));
		return itemsDTO;
	}

	@Override
	public CommunesDTO findById(String id) {
		return this.communesRepository.findById(id).get().convertEntityToDTO();
	}

	@Override
	public List<CommunesDTO> findByDistricts(String id) throws NotFoundException {
		List<CommunesDTO> itemsDTO = new ArrayList<>();
		this.communesRepository.findByDistrictsCustomer(id).stream().forEach(t -> itemsDTO.add(t.convertEntityToDTO()));
		if(itemsDTO.size() <=0) {
			throw new NotFoundException("không có xã nào trong huyện này");
		}
		return itemsDTO;
//		return this.communesRepository.findByDistrictsCustomer(id)
//				.orElseThrow(() -> new NotFoundException("This commune was not found in Districts")).convertEntityToDTO();
	}

	@Override
	public boolean existById(String id) {
		if (this.communesRepository.existsById(id)) {
			return true;
		}
		return false;
	}
}
