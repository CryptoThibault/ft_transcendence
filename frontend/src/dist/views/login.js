var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { navigateTo } from "../main.js";
export class LoginView {
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
      <h2 class="header_custom mt-20 mb-20" data-i18n="login_pong_42">Login Pong 42</h2>
      <form id="login-form" autocomplete="off" class="flex flex-col space-y-8 w-80">
        <label class="text-black text-[14px] text-left">Email</label>
        <input id="user-mail" type="email" autocomplete="off" placeholder="abc123@gmail.com" class="px-3 py-2 rounded bg-gray-200 text-gray-600 text-sm" required />

        <label class="text-black text-[14px] text-left mt-4" data-i18n="password">Password:</label>
        <input id="user-pw" type="password" autocomplete="off" placeholder="******" class="px-3 py-2 rounded bg-gray-200 text-gray-600 text-sm" required />

        <button type="submit" class="bg-blue-600 text-white text-[14px] py-4 rounded hover:bg-blue-800 transition-all" data-i18n="login">Login</button>
        <button type="button" class="bg-black text-white text-[14px] py-4 rounded hover:bg-gray-700 transition-all" data-i18n="login_gg">Login with Google</button>
      </form>
      <div id="login-message" class="mt-4 text-red-900"></div>  
    
      `;
        });
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const form = document.getElementById("login-form");
            const messageDiv = document.getElementById("login-message");
            form.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                const email = form.querySelector("#user-mail").value.trim();
                const password = form.querySelector("#user-pw").value;
                try {
                    const response = yield fetch("/api/v1/auth/sign-in", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });
                    if (!response.ok) {
                        const errorData = yield response.json();
                        messageDiv.textContent = errorData.message;
                        return;
                    }
                    const res = yield response.json();
                    localStorage.setItem("token", res.data.token);
                    navigateTo("/");
                }
                catch (error) {
                    messageDiv.style.color = "red";
                    messageDiv.textContent = "Login failed!";
                }
            }));
        });
    }
}
