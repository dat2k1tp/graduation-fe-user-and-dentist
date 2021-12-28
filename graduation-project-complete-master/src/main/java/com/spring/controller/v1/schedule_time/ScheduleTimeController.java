package com.spring.controller.v1.schedule_time;

import com.spring.dto.model.ScheduleTimeDTO;
import com.spring.dto.response.Response;
import com.spring.exception.NotFoundException;
import com.spring.exception.NotParsableContentException;
import com.spring.service.schedule_time.ScheduleTimeService;
import com.spring.utils.ApiUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/schedule-time")
public class ScheduleTimeController {
	private ScheduleTimeService scheduleTimeService;

	@Autowired
	public ScheduleTimeController(ScheduleTimeService scheduleTimeService) {
		this.scheduleTimeService = scheduleTimeService;
	}

	// read all schedule-time
	@GetMapping("/all")
	public ResponseEntity<Response<List<ScheduleTimeDTO>>> readAll() {
		Response<List<ScheduleTimeDTO>> response = new Response<>();
		response.setData(this.scheduleTimeService.readAll());
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("/add")
	public ResponseEntity<Response<Integer>> add() throws NotFoundException {
		Response<Integer> response = new Response<>();
		try {
			response.setData(scheduleTimeService.addADuto());
		} catch (Exception e) {
			response.setErrors("Thêm schedu-time thất bại");
			e.printStackTrace();
			throw new NotFoundException("Thêm schedu-time thất bại");
		}

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	// findById
	@GetMapping("/{id}")
	public ResponseEntity<Response<ScheduleTimeDTO>> readById(@PathVariable("id") Long id) {
		Response<ScheduleTimeDTO> response = new Response<>();
		response.setData(this.scheduleTimeService.readById(id));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	// find hour by dayOfWeek and dentist_ID
	@GetMapping("/hour")
	public ResponseEntity<Response<List<ScheduleTimeDTO>>> readHour(
			@RequestParam("dayOfWeek") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dayOfWeek,
			@RequestParam("dentistId") Long dentistId) {
		Response<List<ScheduleTimeDTO>> response = new Response<>();
//        LocalDateTime dateTime=LocalDateTime.parse(dayOfWeek+"");
		response.setData(this.scheduleTimeService.readHourByDayAndDentistId(dayOfWeek, dentistId));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping()
	public ResponseEntity<Response<ScheduleTimeDTO>> create(@RequestBody @Valid ScheduleTimeDTO dto,
			BindingResult result) throws NotParsableContentException {

		System.out.println("start : " + dto.getStart());
		System.out.println("end : " + dto.getEnd());
		System.out.println("dayofweek : " + dto.getDayOfWeek());
		Response<ScheduleTimeDTO> response = new Response<>();
		if (result.hasErrors()) {
			result.getAllErrors().forEach(error -> response.addErrorMsgToResponse(error.getDefaultMessage()));
			return ResponseEntity.badRequest().body(response);
		}

		if (!ApiUtil.isEndDateGreaterThanStartDate(dto.getStart(), dto.getEnd())) {
			throw new NotParsableContentException("Ngày bắt đầu schedule time lớn hơn nhày kết thúc voucher");
		}
		response.setData(this.scheduleTimeService.create(dto));
		return new ResponseEntity<>(response, HttpStatus.CREATED);

	}

	@PutMapping("/{id}")
	public ResponseEntity<Response<ScheduleTimeDTO>> update(@RequestBody @Valid ScheduleTimeDTO dto,
			BindingResult result) throws NotParsableContentException {
		Response<ScheduleTimeDTO> response = new Response<>();
		if (result.hasErrors()) {
			result.getAllErrors().forEach(error -> response.addErrorMsgToResponse(error.getDefaultMessage()));
			return ResponseEntity.badRequest().body(response);
		}

		if (!ApiUtil.isEndDateGreaterThanStartDate(dto.getStart(), dto.getEnd())) {
			throw new NotParsableContentException("Ngày bắt đầu schedule time lớn hơn nhày kết thúc voucher");
		}
		response.setData(this.scheduleTimeService.update(dto));
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Response<ScheduleTimeDTO>> delete(@PathVariable Long id) {
		Response<ScheduleTimeDTO> response = new Response<>();
		response.setData(this.scheduleTimeService.delete(id));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	// soft-delete
	@PutMapping("/soft-delete/{id}")
	public ResponseEntity<Response<ScheduleTimeDTO>> soft_delete(@PathVariable Long id,
			@RequestParam Boolean deleteAt) {
		Response<ScheduleTimeDTO> response = new Response<>();
		response.setData(this.scheduleTimeService.updateDeleteAt(id, deleteAt));
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	// read all by deleteAt=TRUE
	@GetMapping("/recycle-bin")
	public ResponseEntity<Response<List<ScheduleTimeDTO>>> getAllDeleteAtTrue() {
		Response<List<ScheduleTimeDTO>> response = new Response<>();
		response.setData(this.scheduleTimeService.readAllDeleteAtTrue());
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	// read all by deleteAt=FALSE
	@GetMapping()
	public ResponseEntity<Response<List<ScheduleTimeDTO>>> getAllDeleteAtFalse() {
		Response<List<ScheduleTimeDTO>> response = new Response<>();
		response.setData(this.scheduleTimeService.readAllDeleteAtFalse());
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	// read all schedule_time with dentist_id
	@GetMapping("/dentist")
	public ResponseEntity<Response<List<ScheduleTimeDTO>>> getAllTimeByDentistId(@RequestParam Long dentistProfileId) {
		Response<List<ScheduleTimeDTO>> response = new Response<>();
		response.setData(this.scheduleTimeService.readAllTimeByDentistId(dentistProfileId));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("/dentist2")
	public ResponseEntity<Response<List<LocalDate>>> getAllTimeByDentistId2(@RequestParam Long dentistProfileId) {
		Response<List<LocalDate>> response = new Response<>();
		response.setData(this.scheduleTimeService.readAllTimeByDentistId2(dentistProfileId));
		System.out.println(response.getData().size() + "size");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}