export class ProfileView {
  async getHtml() {
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

    <!-- Friend Section -->
    <section class="bg-white max-w-5xl w-full mx-auto mt-6 p-4 rounded-lg shadow">
      <h2 class="text-lg text-black font-bold mb-2">Friends</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        <div data-username="Alex" class="user-card">
          <img src="../imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="user-avatar" />
          <div class="user-name">Alex </div>
          <div class="user-actions">
              <button data-i18n="remove_friend" class="btn-remove-friend">Remove Friend</button>
              <button data-i18n="block" class="btn-block">Block</button>
              <button data-i18n="chat" class="btn-send-message">Chat</button>
          </div>          
        </div>

        <div data-username="Dodo" class="user-card">
          <img src="../imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="user-avatar" />
          <div class="user-name">Dodo </div>
          <div class="user-actions">
              <button data-i18n="remove_friend" class="btn-remove-friend">Remove Friend</button>
              <button data-i18n="block" class="btn-block">Block</button>
              <button data-i18n="chat" class="btn-send-message">Chat</button>
          </div>          
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
  }

  async onMounted() {
    const editProfileBtn = document.getElementById("editProfileBtn")!;
    const popup = document.getElementById("editProfilePopup")!;
    const cancelBtn = document.getElementById("cancelEditBtn")!;
    const avatarInput = document.getElementById("avatarInput") as HTMLInputElement;
    const avatarPreview = document.getElementById("editAvatarPreview") as HTMLImageElement;

    const usernameInput = document.getElementById("editUsername") as HTMLInputElement;
    const emailInput = document.getElementById("editEmail") as HTMLInputElement;
    const passwordInput = document.getElementById("editPassword") as HTMLInputElement;

    const currentUsername = (document.getElementById("usernameInput") as HTMLInputElement).value;
    const currentEmail = (document.getElementById("emailInput") as HTMLInputElement).value;
    const currentAvatarSrc = (document.getElementById("profileAvatar") as HTMLImageElement).src;

    const chooseFileBtn = document.getElementById("chooseFileBtn")!;

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
          if (event.target?.result) {
            avatarPreview.src = event.target.result as string;
          }
        };
        reader.readAsDataURL(files[0]);
      }
    });

    const form = document.getElementById("editProfileForm") as HTMLFormElement;
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const newUsername = usernameInput.value.trim();
      const newEmail = emailInput.value.trim();
      const newPassword = passwordInput.value;

      (document.getElementById("usernameInput") as HTMLInputElement).value = newUsername;
      (document.getElementById("emailInput") as HTMLInputElement).value = newEmail;
      (document.getElementById("passwordInput") as HTMLInputElement).value = "******";

      (document.getElementById("profileAvatar") as HTMLImageElement).src = avatarPreview.src;

      popup.classList.add("hidden");
      popup.classList.remove("flex");

      alert("Profile updated!");
    });
  }
}
