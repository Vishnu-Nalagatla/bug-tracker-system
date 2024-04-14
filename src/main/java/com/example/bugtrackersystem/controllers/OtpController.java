package com.example.bugtrackersystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.bugtrackersystem.Entity.UserOtp;
import com.example.bugtrackersystem.requests.GenerateOtpRequest;
import com.example.bugtrackersystem.requests.ValidateOtpRequest;
import com.example.bugtrackersystem.services.UserOtpService;

@RestController
@RequestMapping("/otp")
public class OtpController {

    private final UserOtpService userOtpService;

    @Autowired
    public OtpController(UserOtpService userOtpService) {
        this.userOtpService = userOtpService;
    }

    @PostMapping("/generate")
    public ResponseEntity<UserOtp> generateOtp(@RequestBody GenerateOtpRequest generateOtpRequest) {
        UserOtp generatedOtp = userOtpService.generateOtp(generateOtpRequest.getUserId());
        return ResponseEntity.ok(generatedOtp);
    }

    @PostMapping("/validate")
    public ResponseEntity<String> validateOtp(@RequestBody ValidateOtpRequest validateOtpRequest) {
        if (userOtpService.validateOtp(validateOtpRequest.getUserId(), validateOtpRequest.getOtp())) {
            return ResponseEntity.ok("OTP validated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OTP");
        }
    }
}
