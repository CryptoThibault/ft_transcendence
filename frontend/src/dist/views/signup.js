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
import { setUserData } from "./login.js";
export class SignupView {
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
      <h2 class="header_custom mb-20 mt-20" data-i18n="welcome">Welcome to Pong42</h2>
        <p class="text-lg mb-10 text-black" data-i18n="create_new_ac">Create new account:</p>

    <form id="signup-form" class="flex flex-col text-[13px] space-y-4 w-80">
      <div>
        <label for="username" class="py-4 block text-black text-left w-full" data-i18n="username">Username</label>
        <input id="username" type="text" placeholder="abc123" class="w-full px-3 py-2 rounded bg-gray-200 text-gray-500" />
      </div>

      <div>
        <label for="email" class="py-4 block text-black text-left w-full">Email</label>
        <input id="email" type="email" placeholder="alex@gmail.com" class="w-full px-3 py-2 rounded bg-gray-200 text-gray-500" />
      </div>

      <div>
        <label for="password" class="py-4 block text-black text-left w-full" data-i18n="password">Password</label>
        <input id="password" type="password" placeholder="******" class="w-full px-3 py-2 rounded bg-gray-200 text-gray-500" />
      </div>

      <div>
        <label for="confirm" class="py-4 block text-black text-left w-full" data-i18n="cf_password">Confirm password</label>
        <input id="confirm" type="password" placeholder="******" class="w-full px-3 py-2 rounded bg-gray-200 text-gray-500" />
      </div>

      <button
        type="submit"
        class="mt-2 bg-black text-white py-4 rounded font-bold hover:bg-gray-800 transition-all" data-i18n="register">
        Register
      </button>
    </form>
    <div id="signup-message" class="mt-4 text-red-900"></div>

    `;
        });
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const form = document.getElementById("signup-form");
            const messageDiv = document.getElementById("signup-message");
            form.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                const username = form.querySelector("#username").value.trim();
                const email = form.querySelector("#email").value.trim();
                const password = form.querySelector("#password").value;
                try {
                    const response = yield fetch("http://localhost:5500/api/v1/auth/sign-up", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, email, password }),
                    });
                    if (!response.ok) {
                        const errorData = yield response.json();
                        messageDiv.textContent = errorData.message;
                        return;
                    }
                    const data = yield response.json();
                    messageDiv.style.color = "green";
                    messageDiv.textContent = "Login successful!";
                    setUserData({
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email
                    });
                    setTimeout(() => {
                        navigateTo("/");
                    }, 1500);
                }
                catch (error) {
                    messageDiv.style.color = "red";
                    messageDiv.textContent = "Network error, please try again.";
                }
            }));
        });
    }
}
