import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPValidationPage = () => {
    const [otp, setOTP] = useState('');
    const [isInvalidOTP, setIsInvalidOTP] = useState(false); // State to track invalid OTP
    const navigate = useNavigate();
    const location = useLocation();
    const purpose = location.state?.purpose;
    const loginResponse = location.state?.response;

    console.log('the loginResponse in Otp')
    console.log(loginResponse)

    const handleOTPValidation = async () => {
        // Code to make API call for OTP validation
        try {
            // Make API call to validate OTP
            // const response = await fetch('YOUR_BACKEND_API_URL', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ otp }),
            // });
            const response = {}
            response.status = 200 // Assuming invalid OTP status code
            response.role = 'admin'

            if (response.status === 200) {
                // Successful OTP validation
                if (purpose === 'signup') {
                    // Navigate to dashboard or another page upon successful OTP validation for sign-up
                    navigate('/succesfulSignUp');
                } else if (purpose === 'login') {
                    // Navigate to dashboard or another page upon successful OTP validation for login
                    navigate('/dashboard',{ state: {response: response}});
                }
            } else {
                // Invalid OTP, handle accordingly
                setIsInvalidOTP(true); // Set state to true to show warning message
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleResendOTP = async () => {
        // Code to make API call to resend OTP
        try {
            // Make API call to resend OTP
            // const response = await fetch('YOUR_RESEND_OTP_API_URL', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({}),
            // });
            console.log('Resend OTP requested');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (purpose !== "signup" && purpose !== "login") {
            navigate('/login');
        }
    }, [purpose, navigate]);

    const isSubmitDisabled = otp.trim() === '';

    return (
        <div>
            <h1>OTP Validation Page</h1>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOTP(e.target.value)} />
            {isInvalidOTP && <p style={{ color: 'red' }}>Invalid OTP. Please try again.</p>} {/* Conditional rendering of warning message */}
            <button onClick={handleOTPValidation} disabled={isSubmitDisabled}>Submit</button>
            <button onClick={handleResendOTP}>Resend OTP</button> {/* Button to resend OTP */}
        </div>
    );
};

export default OTPValidationPage;