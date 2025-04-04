
			//document.body.style.zoom = 0.2 + window.innerHeight / 1080 * 0.8;
			
			
			
			function validateUsername(username) {
				// Username must be 3-20 characters and follow the format: Name.Surname
				const usernameRegex = /^[A-Z][a-z]+(\.[A-Z][a-z]+)$/;
				return usernameRegex.test(username);
			}
			
			
			function validateEmail(email) {
				// Simple email validation
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				return emailRegex.test(email);
			}


	
			function showAlert(message) {
				// Find all visible overlays/modals
				const visibleModals = document.querySelectorAll('.overlay[style*="display:block"], .overlay:not([style*="display:none"])');
				
				if (visibleModals.length === 0) {
					// If no visible modals, try to find any alert container on the page
					const anyAlertContainer = document.querySelector('.alert-box-container');
					if (anyAlertContainer) {
						displayAlertIn(anyAlertContainer, message);
					} else {
						console.error("No alert containers found on the page!");
					}
					return;
				}
				
				// For each visible modal, show the alert in its container
				visibleModals.forEach(modal => {
					const alertContainer = modal.querySelector('.alert-box-container');
					if (alertContainer) {
						displayAlertIn(alertContainer, message);
					}
				});
			}
			
			// Helper function to display alert in a specific container
			function displayAlertIn(container, message) {
				container.innerHTML = `
					<div class="alert-box">
						<span class="close-btn">&times;</span>
						${message}
					</div>
				`;
			
				// Add click event for close button
				const closeBtn = container.querySelector('.close-btn');
				if (closeBtn) {
					closeBtn.addEventListener('click', () => {
						container.innerHTML = "";
					});
				}
			
				// Auto-hide after 3 seconds
				setTimeout(() => {
					container.innerHTML = "";
				}, 3000);
			}
			
			
			

function login() {
    var username = document.getElementById("loginUser").value;
    var password = document.getElementById("loginPass").value;

    if (!validateUsername(username)) {
        showAlert("გთხოვთ, შეიყვანოთ თქვენი ლოგინი.");
        return;
    }

    if (password.trim() === "") {
        showAlert("გთხოვთ, შეიყვანოთ თქვენი პაროლი.");
        return;
    }

    mta.triggerEvent("submitLogin", username, password);
}



function forgotPassword() {
    var username = document.getElementById("loginUser").value;
    var resendOtpBtn = document.getElementById("forgotPassword"); 

    if (resendOtpBtn.disabled) {
        return;
    }

    if (!validateUsername(username)) {
        showAlert("Please enter a valid username first.");
        return;
    }


    document.getElementById("otpUser").value = username;

	setTimeout(function() {
		showOTPVerificationModal();
	}, 1500);

}







function handleForgotPassword() {
    var username = document.getElementById("loginUser").value;
    var forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

    if (forgotPasswordBtn.disabled) return;

    if (!validateUsername(username)) {
        showAlert("გთხოვთ, შეიყვანოთ სწორი მომხმარებლის სახელი.");
        return;
    }

    forgotPasswordBtn.disabled = true;
    forgotPasswordBtn.style.opacity = "0.5";
    forgotPasswordBtn.style.cursor = "not-allowed";

    document.getElementById("otpUser").value = username;
    showAlert("იგზავნება კოდი...", true);

    // Set a 2-minute (120 seconds) cooldown
				let cooldownTime = 120;
				const cooldownTimer = setInterval(() => {
					cooldownTime--;
					forgotPasswordBtn.textContent = `Re-send code (${cooldownTime}s)`;
			
					if (cooldownTime <= 0) {
						clearInterval(cooldownTimer);
						forgotPasswordBtn.disabled = false;
						forgotPasswordBtn.style.opacity = "1";
						forgotPasswordBtn.style.cursor = "pointer";
						forgotPasswordBtn.textContent = "Send Code ";
					}
				}, 1000);

    setTimeout(function() {
					
		if (typeof mta !== 'undefined') {
        mta.triggerEvent("submitRecoverRequest", username);
        }
	}, 1500);
}


			
			
			function closeModal(modalId) {
				document.getElementById(modalId).style.display = "none";
			}
			
			function showOTPVerificationModal() {
				document.getElementById("otpVerificationModal").style.display = "flex";
			}
			



			function verifyOTP() {
				var username = document.getElementById("otpUser").value;
				var otp = document.getElementById("otpCode").value;
				
				

				// Trigger the OTP verification and password reset event if MTA is available
				if (typeof mta !== 'undefined') {
					mta.triggerEvent("submitOTPVerify", username, otp);
				} 
			}


			function newPass() {
			// Show new password modal
			closeModal('otpVerificationModal');
			document.getElementById("newPasswordModal").style.display = "flex";
			}

			
			
			function checkPasswordMatch() {
    const newPassword = document.getElementById('otpNewPass').value;
    const confirmPassword = document.getElementById('otpConfirmPass').value;
    const matchStatus = document.getElementById('passwordMatchStatus');
    
    if (confirmPassword === '') {
        matchStatus.textContent = '';
        return;
    }
    
    if (newPassword === confirmPassword) {
        matchStatus.textContent = '✓ Passwords match';
        matchStatus.style.color = "#39FF14"; // Green color for match
        return true;
    } else {
        matchStatus.textContent = '✗ Passwords do not match';
        matchStatus.style.color = "#ff4444"; // Red color for mismatch
        return false;
    }
}
			
function resetPassword() {
    var username = document.getElementById("otpUser").value;
    var otp = document.getElementById("otpCode").value;
    var newPassword = document.getElementById("otpNewPass").value;
    var confirmPassword = document.getElementById("otpConfirmPass").value;
    
    // Get the alert box container in the modal
    let alertBox = document.querySelector("#newPasswordModal .alert-box-container");


	// Check if any field is empty
    if (!username || !otp || !newPassword) {
        showAlert("გთხოვთ, შეიყვანოთ ახალი პაროლი!");
        return;
    }


	// Check if any field is empty
    if (!confirmPassword) {
        showAlert("გთხოვთ, გაიმეორე პაროლი!");
        return;
    }

    
    if (!checkPasswordMatch()) {
        showAlert("პაროლები არ ემთხვევა");
        return;
    }
    
    // Trigger the OTP verification and password reset event if MTA is available
    if (typeof mta !== 'undefined') {
        mta.triggerEvent("submitOTPVerification", username, otp, newPassword, confirmPassword);
    } else {
        // For testing/demo - show success message
        setTimeout(function() {
            showAlert("Password has been successfully reset!");
        }, 1500);
    }
}


function updatedPass() {
// Close modal
closeModal('newPasswordModal');
	}



			
			function sendEmailCode() {
				var email = document.getElementById("registerEmail").value;
				var sendCodeBtn = document.getElementById("sendCodeBtn");
			
				// Check if the button is already disabled
				if (sendCodeBtn.disabled) {
					return;
				}
			
				if (!validateEmail(email)) {
					showAlert("Please enter a valid email first.");
					return;
				}
			
				// Disable the button immediately
				sendCodeBtn.disabled = true;
				sendCodeBtn.style.opacity = "0.5";
				sendCodeBtn.style.cursor = "not-allowed";
			
				// Show sending alert
				showAlert("იგზავნება დამადასტურებელი კოდი თქვენს ელფოსტაზე...", true);
			
				// Set a 2-minute (120 seconds) cooldown
				let cooldownTime = 120;
				const cooldownTimer = setInterval(() => {
					cooldownTime--;
					sendCodeBtn.textContent = `(${cooldownTime}s)`;
			
					if (cooldownTime <= 0) {
						clearInterval(cooldownTimer);
						sendCodeBtn.disabled = false;
						sendCodeBtn.style.opacity = "1";
						sendCodeBtn.style.cursor = "pointer";
						sendCodeBtn.textContent = "კოდის მიღება ";
					}
				}, 1000);
			
				setTimeout(function() {
					
					if (typeof mta !== 'undefined') {
						mta.triggerEvent("submitEmailCode", email);
					}
				}, 1500);
			}



			

			function register() {
				var username = document.getElementById("registerUser").value;
				var password = document.getElementById("registerPass").value;
				var email = document.getElementById("registerEmail").value;
				var otp = document.getElementById("emailCode").value;
				
				// Check if gender is selected (this will throw an error if none selected)
				try {
					var gender = document.querySelector('input[name="registerGender"]:checked').value;
				} catch (error) {
					showAlert("შეავსე ყველა ველი"); // "Fill in all fields" in Georgian
					return;
				}
				
				// Check if any of the fields are empty
				if (!username || !password || !email || !otp) {
					showAlert("შეავსე ყველა ველი"); // "Fill in all fields" in Georgian
					return;
				}
				
				// Continue with existing validation
				if (!validateUsername(username)) {
					showAlert("შეაიყვანე მომხმარებლის სახელი");
					return;
				}
				
				
				
				mta.triggerEvent("submitRegister", username, password, email, otp, gender);
			}
						
			
			function showPass(element) {
				// Get the parent container of the eye icon to find the associated input
				var container = element.closest('.password-container');
				var inputpass = container.querySelector('input[type="password"], input[type="text"]');
				var eyeimg = element.querySelector("img");
				
				if (inputpass.type === "password") {
					inputpass.type = "text";
					eyeimg.src = "img/eye.png";
				} else {
					inputpass.type = "password";
					eyeimg.src = "img/eye1.png";
				}
			}
			  
			
			
			// Add input event listeners to validate in real-time
			window.onload = function() {


				var otpCodeInput = document.getElementById("otpCode");
				var emailCodeInput = document.getElementById("emailCode");
			
				if (otpCodeInput) {
					otpCodeInput.addEventListener("keypress", function(event) {
						// Allow only numeric keypress
						if (event.which < 48 || event.which > 57) {
							event.preventDefault();
						}
					});
				}
			
				if (emailCodeInput) {
					emailCodeInput.addEventListener("keypress", function(event) {
						// Allow only numeric keypress
						if (event.which < 48 || event.which > 57) {
							event.preventDefault();
						}
					});
				}





				document.getElementById("loginUser").addEventListener("input", function() {
					if (!validateUsername(this.value) && this.value !== "") {
						this.style.borderColor = "red";
					} else {
						this.style.borderColor = "";
					}
				});
				
				document.getElementById("registerUser").addEventListener("input", function() {
					if (!validateUsername(this.value) && this.value !== "") {
						this.style.borderColor = "red";
					} else {
						this.style.borderColor = "";
					}
				});
				
				// Check if email is valid in real-time
				document.getElementById("registerEmail").addEventListener("input", function() {
					if (!validateEmail(this.value) && this.value !== "") {
						this.style.borderColor = "red";
					} else {
						this.style.borderColor = "";
					}
				});
				
				document.getElementById("recoverUser").addEventListener("input", function() {
					if (!validateUsername(this.value) && this.value !== "") {
						this.style.borderColor = "red";
					} else {
						this.style.borderColor = "";
					}
				});
				
				document.getElementById("recoverEmail").addEventListener("input", function() {
					if (!validateEmail(this.value) && this.value !== "") {
						this.style.borderColor = "red";
					} else {
						this.style.borderColor = "";
					}
				});
				
				document.getElementById("otpUser").addEventListener("input", function() {
					if (!validateUsername(this.value) && this.value !== "") {
						this.style.borderColor = "red";
					} else {
						this.style.borderColor = "";
					}
				});

				
			};



			document.querySelectorAll("#loginUser, #registerUser").forEach(input => {
				input.addEventListener("focus", function(event) {
					event.target.blur(); // ფოკუსი ავტომატურად მოიხსნება
				});
			});



			// Custom event handlers for MTA communication
			if (typeof mta !== 'undefined') {
				// Event handler for when OTP is sent successfully
				mta.addEventHandler('showOTPVerification', function() {
					showOTPVerificationModal();
				});
				
				// Event handler for notification messages
				mta.addEventHandler('setNotification', function(message, isSuccess) {
					showAlert(message, isSuccess);
				});
			}
			

			
			 function requestPlayerName() {
        luaTrigger("onCEFRequestPlayerName");
    }

    function setPlayerName(name) {
        document.getElementById("loginUser").value = name;
        document.getElementById("registerUser").value = name;
    }

    window.onload = requestPlayerName;



 try {
        eval('console.log("✅ Eval მუშაობს Render-ზე")');
    } catch(e) {
        console.error("❌ Eval არ მუშაობს:", e);
    }
