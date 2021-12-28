package com.spring.dto.model;

import com.spring.model.DentistProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.modelmapper.ModelMapper;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DentistProfileDTO {

	
    private Long id;

    @NotNull(message = "Accounts không để trống")
    AccountsDTO accounts;

    private String image;

    @NotBlank(message = "Không được để trống cccd")
    private String cccd;

    @NotBlank(message = "Không được để trống họ tên")
    @Size(max = 30)
    private String fullName;

    private Date birthday = new Date();

    @NotNull(message = "Gender không để trống")
    private Boolean gender;

    @NotNull(message = "Communes không để trống")
    CommunesDTO communes;
    
    @NotBlank(message = "Địa chỉ không để trống")
    private String diachi;

    @NotBlank(message = "Không được để trống số điện thoại")
    @Size(max = 30)
    private String telephone;

    @NotBlank(message = "Không được để trống kinh nghiệm làm việc")
    private String exp;

    private Date createAt = new Date();

    private Date updateAt = new Date();

    private Boolean deleteAt;

    public DentistProfile convertDTOToEntity() {
        return new ModelMapper().map(this, DentistProfile.class);
    }
}
