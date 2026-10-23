package com.murthy.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {
    @NotBlank(message = "Place cannot be blank")
    private String place;

    @NotBlank(message = "landmark cannot be blank")
    private String landmark;

    @NotBlank(message = "city cannot be blank")
    private String city;

    @NotBlank(message = "state cannot be blank")
    private String state;

    @NotBlank(message = "Pincode cannot be blank")
    private String pinCode;

    @NotBlank(message = "Country cannot be blank")
    private String country;
}
