package com.spring.dto.model;

import com.spring.model.Districts;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.modelmapper.ModelMapper;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DistrictsDTO {

//    @NotBlank(message = "Không được để trống id")
    private String id;

    @NotBlank(message = "Không được để trống tên")
    private String name;

    @NotBlank(message = "Không được để trống type")
    private String type;

    @NotNull
    ProvincesDTO provinces;

    public Districts convertDTOToEntity() {
        return new ModelMapper().map(this, Districts.class);
    }

}
