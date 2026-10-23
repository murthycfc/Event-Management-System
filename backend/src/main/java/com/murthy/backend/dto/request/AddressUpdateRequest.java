package com.murthy.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressUpdateRequest {
    private String place;
    private String landmark;
    private String city;
    private String state;
    private String pinCode;
    private String country;
}
