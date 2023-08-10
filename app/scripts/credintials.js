document.addEventListener("DOMContentLoaded", async function () {
    const loginForm = document.getElementById("loginForm");
    const registrationForm = document.getElementById("registrationForm");
    const logoutButton = document.getElementById("logoutButton");
    const loginStatus = document.getElementById("loginStatus"); // Added loginStatus
  
    async function verifyToken() {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }
  
      try {
        const response = await fetch("/verify_token", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        return data.valid;
      } catch (error) {
        console.error("Error verifying token:", error);
        return false;
      }
    }
  
    async function updateUI() {
      const tokenValid = await verifyToken();
  
      if (tokenValid) {
        handleLogin();
      } else {
        handleLogout();
      }
    }
  
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;
  
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          updateUI(); // Use updateUI instead of handleLogin
        } else {
          alert("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    });
  
    registrationForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("regUsername").value;
      const password = document.getElementById("regPassword").value;
  
      try {
        const response = await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
        if (data.success) {
          alert("Registration successful. You can now log in.");
        } else {
          alert("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    });
  
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("token");
      updateUI(); // Use updateUI instead of handleLogout
    });
  
    // Initial UI update based on token status
    updateUI();
  });
  