import { navigateTo } from "../main.js";

export class LoginView {
  async getHtml() {
    return `
      <h2 class="header_custom mt-20 mb-20" data-i18n="login_pong_42">Login Pong 42</h2>
      <form id="login-form" autocomplete="off" class="flex flex-col text-[14px] space-y-8 w-80">
        <label class="text-black text-left">Email</label>
        <input id="user-mail" type="email" autocomplete="off" placeholder="abc123@gmail.com" class="px-3 py-2 rounded bg-gray-200 text-gray-500" required />

        <label class="text-black text-left mt-4" data-i18n="password">Password:</label>
        <input id="user-pw" type="password" autocomplete="off" placeholder="******" class="px-3 py-2 rounded bg-gray-200 text-gray-500" required />

        <button type="submit" class="bg-blue-600 text-white py-4 rounded hover:bg-blue-800 transition-all" data-i18n="login">Login</button>
        <button type="button" class="bg-black text-white py-4 rounded hover:bg-gray-700 transition-all" data-i18n="login_gg">Login with Google</button>
      </form>
      <div id="login-message" class="mt-4 text-red-900"></div>
    
      `;
    }
    

  async onMounted() {
    const form = document.getElementById("login-form") as HTMLFormElement;
    const messageDiv = document.getElementById("login-message") as HTMLElement;
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

        if (!response.ok) {
          const errorData = await response.json();
          messageDiv.textContent = errorData.message;
          return;
        }

        const data = await response.json();
        localStorage.setItem("token", data.data.token);
        navigateTo("/");

      } catch (error) {
        messageDiv.style.color = "red";
        messageDiv.textContent = "Login failed!";
      }
    });
  }
}
