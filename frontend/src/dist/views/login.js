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
        });
    }
    //   <div id="modal-message" class="fixed inset-0 items-center justify-center bg-black bg-opacity-50 hidden">
    //   <div class="bg-white rounded p-6 max-w-xs text-center">
    //     <p id="modal-text" class="text-red-600 mb-4"></p>
    //     <button id="modal-close" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800 transition">Close</button>
    //   </div>
    // </div>
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const form = document.getElementById("login-form");
            const messageDiv = document.getElementById("login-message");
            // const modal = document.getElementById("modal-message") as HTMLElement;
            // const modalText = document.getElementById("modal-text") as HTMLElement;
            // const modalClose = document.getElementById("modal-close") as HTMLElement;
            // modalClose.addEventListener("click", () => {
            //   modal.classList.add("hidden");
            // });
            form.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                // if (!form.checkValidity()) {
                //   form.reportValidity();
                //   return;
                // }
                const email = form.querySelector("#user-mail").value.trim();
                const password = form.querySelector("#user-pw").value;
                // if (!email || !password) {
                //   modalText.textContent = "Please fill in all fields.";
                //   modal.classList.remove("hidden");
                //   modal.classList.add("flex");
                //   return;
                // }
                try {
                    const response = yield fetch("http://localhost:5500/api/v1/auth/sign-in", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });
                    if (!response.ok) {
                        const errorData = yield response.json();
                        messageDiv.textContent = errorData.message;
                        return;
                    }
                    const data = yield response.json();
                    messageDiv.style.color = "green";
                    messageDiv.textContent = "Login successful!";
                    //set login state
                    setTimeout(() => {
                        navigateTo("/");
                    }, 1500);
                }
                catch (error) {
                    messageDiv.style.color = "red";
                    messageDiv.textContent = "Network error, please try again.";
                    //Using for test login success
                    // messageDiv.style.color = "green";
                    // messageDiv.textContent = "Login successful test!";
                    // setTimeout(() => {
                    //   navigateTo("/");
                    // }, 1500);
                }
            }));
        });
    }
}
