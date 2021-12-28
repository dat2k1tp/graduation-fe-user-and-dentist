package com.spring.controller.v1.voucher;

import com.spring.dto.model.VoucherDTO;
import com.spring.dto.response.Response;
import com.spring.exception.NotFoundException;
import com.spring.exception.NotParsableContentException;
import com.spring.model.Voucher;
import com.spring.service.voucher.VoucherService;
import com.spring.service.voucher.VoucherServiceImpl;
import com.spring.utils.ApiUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1/vouchers")
public class VoucherController {

	private final VoucherService voucherService;

	@Autowired
	public VoucherController(VoucherService voucherService) {
		this.voucherService = voucherService;
	}

	@Autowired
	VoucherServiceImpl voucherServiceImpl;

	@GetMapping
	public ResponseEntity<Response<List<VoucherDTO>>> getAll() {

		Response<List<VoucherDTO>> response = new Response<>();
		response.setData(this.voucherService.findAll());

		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
	@PostMapping("/{customerId}/{sale}")
	public ResponseEntity<Response<?>> create(
			@PathVariable("customerId") Long CustomerId, @PathVariable("sale") Double sale)
			throws NotParsableContentException {
		Response<?> response = voucherService.sentVoucherByAdmin(CustomerId, sale);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

//	@PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
//	@PostMapping()
//	public ResponseEntity<Response<VoucherDTO>> create(@Valid @RequestBody VoucherDTO dto, BindingResult result)
//			throws NotParsableContentException {
//
//		Response<VoucherDTO> response = new Response<>();
//
//		if (result.hasErrors()) {
//			result.getAllErrors().forEach(error -> response.addErrorMsgToResponse(error.getDefaultMessage()));
//			return ResponseEntity.badRequest().body(response);
//		}
//
//		if (!ApiUtil.isEndDateGreaterThanStartDate(dto.getStart(), dto.getEnd())) {
//			throw new NotParsableContentException("Ngày bắt đầu voucher lớn hơn nhày kết thúc voucher");
//		}
//
//		response.setData(this.voucherService.save(dto));
//
//		return ResponseEntity.status(HttpStatus.CREATED).body(response);
//	}

	@PreAuthorize("hasAnyRole('ADMIN' or 'RECEPTIONIST')")
	@PutMapping(value = "/{id}")
	public ResponseEntity<Response<VoucherDTO>> update(@Valid @RequestBody VoucherDTO dto, BindingResult result)
			throws NotParsableContentException {

		Response<VoucherDTO> response = new Response<>();

		if (result.hasErrors()) {
			result.getAllErrors().forEach(error -> response.addErrorMsgToResponse(error.getDefaultMessage()));
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

		if (!ApiUtil.isEndDateGreaterThanStartDate(dto.getStart(), dto.getEnd())) {
			throw new NotParsableContentException("Ngày bắt đầu voucher lớn hơn nhày kết thúc voucher");
		}
		response.setData(this.voucherService.update(dto));

		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
	@DeleteMapping(value = "/{id}")
	public void deleteVoucher(@PathVariable("id") String id) throws NotFoundException {
		this.voucherService.hardDelete(id);
	}

	@GetMapping(value = "/byTitle")
	public ResponseEntity<Response<List<VoucherDTO>>> findAllByTitle(@RequestParam(required = false) String title) {
		Response<List<VoucherDTO>> response = new Response<>();

		response.setData(this.voucherService.findByTitle(title));

		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	//Tìm theo id voucher và deleteAt=false
	@GetMapping(value = "/byId/{id}")
	public ResponseEntity<Response<Optional<VoucherDTO>>> findByIDAndDeleteAtFalse
	(@PathVariable("id") String id) {
		Response<Optional<VoucherDTO>> response = new Response<>();

		response.setData(this.voucherService.findByIdAndDeleteAtFalse(id));

		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	//Tìm theo id voucher
	@GetMapping(value = "/byId/all-status/{id}")
	public ResponseEntity<Response<Optional<VoucherDTO>>> findByID
	(@PathVariable("id") String id) {
		Response<Optional<VoucherDTO>> response = new Response<>();

		response.setData(this.voucherService.findById(id));

		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@GetMapping(value = "/byBetweenDates")
	public ResponseEntity<Response<List<VoucherDTO>>> findAllBetweenDates(
			@RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd", iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd", iso = DateTimeFormat.ISO.DATE) LocalDate endDate

	) throws NotFoundException {

		Response<List<VoucherDTO>> response = new Response<>();

//        System.out.println("start date : " + startDate);
//        System.out.println("end date :" + endDate);
		LocalDateTime startDateTime = ApiUtil.convertLocalDateToLocalDateTime(startDate);
		LocalDateTime endDateTime = ApiUtil.convertLocalDateToLocalDateTime(endDate);

		List<Voucher> vouchers = this.voucherService.findBetweenDates(startDateTime, endDateTime);

		if (vouchers.isEmpty()) {
			throw new NotFoundException(
					"Không có voucher nào đc tạo giữa startDate : " + startDateTime + " và endDate : " + endDateTime);
		}

		List<VoucherDTO> itemDTO = new ArrayList<>();

		vouchers.stream().forEach(t -> itemDTO.add(t.convertEntityToDTO()));

		response.setData(itemDTO);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping(value = "/checkExprDate")
	public ResponseEntity<Response<List<VoucherDTO>>> checkExpVoucher(
			@RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss", iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
			@RequestParam("nowDate") @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss", iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime nowDate

	) throws NotFoundException {

		Response<List<VoucherDTO>> response = new Response<>();

		List<VoucherDTO> itemDTO=this.voucherService.checkExprVoucher(endDate,nowDate);

		response.setData(itemDTO);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@PreAuthorize("isAuthenticated()")
	@PutMapping(value = "/soft-delete/{id}")
	public ResponseEntity<Response<VoucherDTO>> softDeleteVoucher
			(@PathVariable("id") String id) throws NotFoundException {
		Response<VoucherDTO> response = new Response<>();
		response.setData(this.voucherService.softDelete(id));
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

}
