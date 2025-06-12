var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ProfileView {
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
    <section class="bg-gray-100 max-w-5xl w-full mx-auto rounded-lg shadow-md p-4 sm:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
      
      <div class="flex flex-col items-center h-56">
          <div class="flex-grow"></div> 
          <img id="profileAvatar" src="../imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="Avatar" class="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow" />  
          <div class="flex-grow"></div>
          <button id="editProfileBtn" data-i18n="edit_profile" class="bg-blue-500 text-white px-4 py-1 rounded shadow hover:bg-blue-600 w-full max-w-xs mt-auto">
            Edit profile
          </button>
      </div>
      
      <!-- Info -->
      <div class="flex-1 bg-white rounded p-4 shadow space-y-4">
        <div>
          <label data-i18n="username" class="text-black text-left block font-semibold">Username</label>
          <input id="usernameInput" type="text" disabled value="abc123" class="w-full mt-1 p-2 rounded bg-gray-200 text-gray-600"/>
        </div>
        <div>
          <label data-i18n="email" class="text-black text-left block font-semibold">Email</label>
          <input id="emailInput" type="text" disabled value="abc@gmail.com" class="w-full mt-1 p-2 rounded bg-gray-200 text-gray-600"/>
        </div>
        <div>
          <label data-i18n="password" class="text-black text-left block font-semibold">Password</label>
          <input id="passwordInput" type="password" disabled value="******" class="w-full mt-1 p-2 rounded bg-gray-200 text-gray-600"/>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-white max-w-5xl w-full mx-auto mt-6 p-4 rounded-lg shadow">
      <h2 class="text-lg text-black font-bold mb-2">Stats</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 text-gray-700 gap-2 text-center">
        <div data-i18n="total">Total: 0</div>
        <div data-i18n="win">Win: 0</div>
        <div data-i18n="lose">Lose: 0</div>
      </div>
    </section>

    <!-- History Section -->
    <section class="bg-white max-w-5xl w-full mx-auto mt-6 p-4 rounded-lg shadow">
      <h2 data-i18n="history" class="text-lg font-bold mb-2 text-black">History</h2>
      <p data-i18n="no_history_yet" class="text-gray-600 italic">No history yet.</p>
    </section>

    <!-- Edit Profile Popup -->
    <div id="editProfilePopup" class="text-black fixed inset-0 hidden items-center justify-center  bg-black/50 backdrop-blur-sm  z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h2 class="text-xl font-bold mb-4" data-i18n="edit_profile">Edit Profile</h2>
        <form id="editProfileForm" class="space-y-4">
        <div class="flex flex-col items-center">
          <img id="editAvatarPreview" src="../imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="Avatar Preview" class="w-24 h-24 rounded-full mb-2 object-cover" />
          <input type="file" id="avatarInput" accept="image/*" class="hidden" />
          <button id="chooseFileBtn" type="button" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Choose Avatar
          </button>
        </div>
          <div>
            <label for="editUsername" class="text-left  block font-semibold text-black mb-1" data-i18n="username">Username</label>
            <input type="text" id="editUsername" class="w-full border rounded p-2" required />
          </div>
          <div>
            <label for="editEmail" class="text-left block font-semibold text-black mb-1" data-i18n="email">Email</label>
            <input type="email" id="editEmail" class="w-full border rounded p-2" required />
          </div>
          <div>
            <label for="editPassword" class="text-left block font-semibold text-black mb-1" data-i18n="password">Password</label>
            <input type="password" id="editPassword" class="w-full border rounded p-2" />
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" id="cancelEditBtn" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" data-i18n="cancel">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" data-i18n="save">Save</button>
          </div>
        </form>
      </div>
    </div>
    `;
        });
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const editProfileBtn = document.getElementById("editProfileBtn");
            const popup = document.getElementById("editProfilePopup");
            const cancelBtn = document.getElementById("cancelEditBtn");
            const avatarInput = document.getElementById("avatarInput");
            const avatarPreview = document.getElementById("editAvatarPreview");
            const usernameInput = document.getElementById("editUsername");
            const emailInput = document.getElementById("editEmail");
            const passwordInput = document.getElementById("editPassword");
            const currentUsername = document.getElementById("usernameInput").value;
            const currentEmail = document.getElementById("emailInput").value;
            const currentAvatarSrc = document.getElementById("profileAvatar").src;
            const chooseFileBtn = document.getElementById("chooseFileBtn");
            chooseFileBtn.addEventListener("click", () => {
                avatarInput.click();
            });
            editProfileBtn.addEventListener("click", () => {
                popup.classList.remove("hidden");
                popup.classList.add("flex");
                usernameInput.value = currentUsername;
                emailInput.value = currentEmail;
                passwordInput.value = "";
                avatarPreview.src = currentAvatarSrc;
            });
            cancelBtn.addEventListener("click", () => {
                popup.classList.add("hidden");
                popup.classList.remove("flex");
            });
            avatarInput.addEventListener("change", (e) => {
                const files = avatarInput.files;
                if (files && files[0]) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        var _a;
                        if ((_a = event.target) === null || _a === void 0 ? void 0 : _a.result) {
                            avatarPreview.src = event.target.result;
                        }
                    };
                    reader.readAsDataURL(files[0]);
                }
            });
            const form = document.getElementById("editProfileForm");
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const newUsername = usernameInput.value.trim();
                const newEmail = emailInput.value.trim();
                const newPassword = passwordInput.value;
                document.getElementById("usernameInput").value = newUsername;
                document.getElementById("emailInput").value = newEmail;
                document.getElementById("passwordInput").value = "******";
                document.getElementById("profileAvatar").src = avatarPreview.src;
                popup.classList.add("hidden");
                popup.classList.remove("flex");
                alert("Profile updated!");
            });
        });
    }
}
