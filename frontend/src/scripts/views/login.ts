import { navigateTo } from "../main.js";

export class LoginView {
  async getHtml() {
    return `
      <h2 class="header_custom mt-20 mb-20" data-i18n="login_pong_42">Login Pong 42</h2>
      <form id="login-form" autocomplete="off" class="flex flex-col text-[14px] space-y-8 w-80">
        <label class="text-black text-left">Email</label>
        <input id="user-mail" type="email" placeholder="abc123@gmail.com"
          class="px-3 py-2 rounded bg-gray-200 text-gray-500" required />

        <label class="text-black text-left mt-4" data-i18n="password">Password:</label>
        <input id="user-pw" type="password" placeholder="******"
          class="px-3 py-2 rounded bg-gray-200 text-gray-500" required />

        <div id="otp-section" class="hidden">
          <label class="text-black text-left mt-4">OTP:</label>
          <input id="user-otp" type="text" placeholder="Enter OTP"
            class="px-3 py-2 rounded bg-gray-200 text-gray-500" />
          <button id="verify-otp-btn" type="button"
            class="bg-green-600 text-white py-2 rounded hover:bg-green-800 transition-all mt-2">
            Verify OTP
          </button>
        </div>

        <button type="submit"
          class="bg-blue-600 text-white py-4 rounded hover:bg-blue-800 transition-all"
          data-i18n="login">
          Login
        </button>

        <button type="button"
          class="bg-black text-white py-4 rounded hover:bg-gray-700 transition-all"
          data-i18n="login_gg">
          Login with Google
        </button>
      </form>

      <div id="login-message" class="mt-4 text-red-900"></div>
    `;
  }

  async onMounted() {
    const form = document.getElementById("login-form") as HTMLFormElement;
    const messageDiv = document.getElementById("login-message") as HTMLElement;
    const otpSection = document.getElementById("otp-section") as HTMLDivElement;
    const verifyOtpBtn = document.getElementById("verify-otp-btn") as HTMLButtonElement;

    let tempToken: string | null = null;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = (form.querySelector("#user-mail") as HTMLInputElement).value.trim();
      const password = (form.querySelector("#user-pw") as HTMLInputElement).value;

      try {
        const response = await fetch("/api/v1/auth/sign-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          messageDiv.textContent = data.message || "Login failed.";
          return;
        }

        if (data.twoFactorRequired) {
          tempToken = data.tempToken;
          otpSection.classList.remove("hidden");
          messageDiv.textContent = "Two-factor authentication required. Please enter your OTP.";
        } else {
          localStorage.setItem("token", data.data.token);
          navigateTo("/");
        }

      } catch (error) {
        console.error(error);
        messageDiv.textContent = "Login failed due to network or server error.";
      }
    });

    verifyOtpBtn.addEventListener("click", async () => {
      const otp = (document.getElementById("user-otp") as HTMLInputElement).value.trim();

      if (!otp || !tempToken) {
        messageDiv.textContent = "OTP or temporary token is missing.";
        return;
      }

      try {
        const response = await fetch("/api/v1/auth/2fa/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tempToken}`
          },
          body: JSON.stringify({ token: otp }),
        });

        const data = await response.json();

        if (!response.ok) {
          messageDiv.textContent = data.message || "OTP verification failed.";
          return;
        }

        localStorage.setItem("token", data.data.token);
        navigateTo("/");

      } catch (error) {
        console.error(error);
        messageDiv.textContent = "OTP verification failed.";
      }
    });
  }
}