import { navigateTo } from "../main";

export class ProfileView {
  constructor(private username?: string, private isMyProfile: boolean = true) {
  }
  async getHtml() {
    return `
    <section class="bg-gray-100 max-w-5xl w-full mx-auto rounded-lg shadow-md p-4 sm:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
      
      <div class="font-mono flex flex-col items-center h-40">
          <div class="flex-grow"></div> 
          <img id="profileAvatar" src="./src/imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="Avatar" class="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow" />  
          <div class="flex-grow"></div>
          ${this.isMyProfile ? `
            <button id="editProfileBtn" data-i18n="edit_profile" class="bg-blue-500 text-white px-4 py-1 rounded shadow hover:bg-blue-600 w-full max-w-xs mt-auto">
              Edit profile
            </button>` : ""}
      </div>
      
      <!-- Info -->
      <div class="font-mono flex-1 bg-white rounded p-4 shadow space-y-4">
        <div>
          <label data-i18n="username" class="text-black text-left block font-semibold">Username</label>
          <input id="usernameInput" type="text" disabled value="" class="w-full mt-1 p-2 rounded bg-gray-200 text-gray-600"/>
        </div>
        <div>
          <label data-i18n="email" class="text-black text-left block font-semibold">Email</label>
          <input id="emailInput" type="text" disabled value="" class="w-full mt-1 p-2 rounded bg-gray-200 text-gray-600"/>
        </div>
        </div>
        </section>
        
        <!-- Friend Section -->
        <section class="bg-white max-w-5xl w-full mx-auto mt-6 p-4 rounded-lg shadow">
        <h2 class="font-mono text-lg text-black font-bold mb-2">Friends</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        
        <div data-username="Alex" class="user-card">
        <img src="./src/imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="user-avatar" />
        <a href="/" class="user-name" data-link>Alex </a>
        <div class="user-actions">
        <button data-i18n="remove_friend" class="btn-remove-friend">Remove</button>
        <button data-i18n="block" class="btn-block">Block</button>
        <button data-i18n="chat" class="btn-send-message">Chat</button>
        </div>          
        </div>
        
        <div data-username="Dodo" class="user-card">
        <img src="./src/imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="user-avatar" />
        <a href="/" class="user-name" data-link>Dodo </a>
        <div class="user-actions">
        <button data-i18n="remove_friend" class="btn-remove-friend">Remove Friend</button>
        <button data-i18n="block" class="btn-block">Block</button>
        <button data-i18n="chat" class="btn-send-message">Chat</button>
        </div>          
        </div>
        
        </div>
        </section>
        
        <!-- Stats Section -->
        <section class="font-mono bg-white max-w-5xl w-full mx-auto mt-6 p-4 rounded-lg shadow">
        <h2 class=" text-lg text-black font-bold mb-2">Stats</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 text-gray-700 gap-2 text-center">
        <div data-i18n="total">Total</div> 
        <div data-i18n="win">Win</div>
        <div data-i18n="lose">Lose</div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 text-gray-700 gap-2 text-center">
        <div id="total">x</div> 
        <div id="win">x</div> 
        <div id="lose">x</div> 
        </section>
        
        <!-- history Section -->
        <section class="font-mono bg-white max-w-5xl w-full mx-auto mt-6 p-4 rounded-lg shadow">
          <h2 data-i18n="history" class="text-lg font-bold mb-4 text-black">History</h2>
          
          <div class="overflow-x-auto">
            <table class="min-w-full table-fixed w-full border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="w-1/3 text-center py-2 text-gray-700" data-i18n="opponent">Opponent</th>
                  <th class="w-1/3 text-center py-2 text-gray-700" data-i18n="score">Score</th>
                  <th class="w-1/3 text-center py-2 text-gray-700" data-i18n="status">Status</th>
                </tr>
              </thead>
              <tbody id="historyTableBody" class="text-center text-gray-700">
              </tbody>
            </table>
            <p id="noHistoryMessage" class="text-gray-600 italic mt-2 hidden" data-i18n="no_history_yet">No history yet.</p>
          </div>
        </section>

        
        <!-- Edit Profile Popup -->
        <div id="editProfilePopup" class="text-black font-mono fixed inset-0 hidden items-center justify-center  bg-black/50 backdrop-blur-sm  z-50">
          <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h2 class="text-xl font-bold mb-4" data-i18n="edit_profile">Edit Profile</h2>
            <form id="editProfileForm" class="space-y-4">
            <div class="flex flex-col items-center">
              <img id="editAvatarPreview" src="./src/imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="Avatar Preview" class="w-24 h-24 rounded-full mb-2 object-cover" />
              <p data-i18n="changeAvt">Change avatar:</p>
              <div id="avtOptions" class="flex flex-row">
                <img src="./src/imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" class="mx-2 w-12 h-12 rounded-full border object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 " />
                <img src="./src/imgs/cat.jpg" class="mx-2 w-12 h-12 rounded-full border object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 " />
                <img src="./src/imgs/dog.jpg" class="mx-2 w-12 h-12 rounded-full border object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 " />
                <img src="./src/imgs/chicken.jpg" class="mx-2 w-12 h-12 rounded-full border object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 " />
                <img src="./src/imgs/monkey.jpg" class="mx-2 w-12 h-12 rounded-full border object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 " />
              </div>


            </div>
        <div>
        <label for="editUsername" class="text-left block font-semibold text-black mb-1" data-i18n="username">Username</label>
        <input type="text" id="editUsername" class="w-full border rounded p-2" required />
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
    try {
      await this.setupProfileDefault();
      if (this.isMyProfile) {
        this.handleEditProfile();
      }
      await this.loadHistory();
    } catch (err: any) {
      alert(err);
      navigateTo("/");
    }
  }

  
  private async setupProfileDefault() {
    const url = this.isMyProfile? "/api/v1/user/me": `/api/v1/user/${this.username}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const userData = await response.json();
      if (!response.ok) {
        throw new Error(userData.message || "Failed to fetch user data");
      }
      const username = document.getElementById("usernameInput") as HTMLInputElement;
      const email = document.getElementById("emailInput") as HTMLInputElement;
      // const profileAvatar = document.getElementById("profileAvatar") as HTMLImageElement;
      
      username.value = userData.data.user.name;
      email.value = userData.data.user.email;
      // profileAvatar.src = userData.data.user.avatar;

      const statsTotal = document.getElementById("total")!;
      const statsWin = document.getElementById("win")!;
      const statsLose = document.getElementById("lose")!;

      const wins = userData.data.user.wins;
      const losses = userData.data.user.losses;
      const total = wins + losses;

      statsWin.textContent = wins;
      statsLose.textContent = losses;
      statsTotal.textContent = total;
    } catch (error:any) {
      throw new Error(error);
    }
  }            
  
  private handleEditProfile() {
    const editProfileBtn = document.getElementById("editProfileBtn")!;
    const popup = document.getElementById("editProfilePopup")!;
    const cancelBtn = document.getElementById("cancelEditBtn")!;
    const avatarPreview = document.getElementById("editAvatarPreview") as HTMLImageElement;    
    const usernameInput = document.getElementById("editUsername") as HTMLInputElement;    
    const currentUsername = (document.getElementById("usernameInput") as HTMLInputElement).value;
    const currentAvatarSrc = (document.getElementById("profileAvatar") as HTMLImageElement).src;    

   
    let selectedAvt = currentAvatarSrc;

    editProfileBtn.addEventListener("click", () => {
      popup.classList.remove("hidden");
      popup.classList.add("flex");
  
      usernameInput.value = currentUsername;
      avatarPreview.src = currentAvatarSrc;
      selectedAvt = currentAvatarSrc;

    });
    
    cancelBtn.addEventListener("click", () => {
      popup.classList.add("hidden");
      popup.classList.remove("flex");
    });
    
    const avatarOptions = document.querySelectorAll("#avtOptions img");
    avatarOptions.forEach((img) => {
      img.addEventListener("click", () => {
        selectedAvt = img.getAttribute("src")!;
        avatarPreview.src = selectedAvt;
      });
    });

    const form = document.getElementById("editProfileForm") as HTMLFormElement;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const newUsername = usernameInput.value.trim();
      const newAvt = avatarPreview.src;
      if (!newUsername) {
        alert("Username cannot be empty.");
        return;
      }
      if (newUsername.length < 3 || newUsername.length > 20) {
        alert("Username must be between 3 and 20 characters.");
        return;
      }

      try {
        const response = await fetch("/api/v1/user/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: newUsername,
            // avatar: selectedAvt,
          }),
        });
        const res = await response.json();
        if (!response.ok) {
          throw new Error(res.message || "Failed to update profile");
        }
          
        (document.getElementById("usernameInput") as HTMLInputElement).value = newUsername;
        (document.getElementById("profileAvatar") as HTMLImageElement).src = newAvt;
        
        popup.classList.add("hidden");
        popup.classList.remove("flex");
        
        alert("Profile updated!");
      } catch (err) {
        console.error("Error updating profile:", err);
        alert(`Error updating profile: ${err}`);
    }
  });
  }

  private async loadHistory() {
    const userId = this.isMyProfile ? 'me' : this.username;
  const url = this.isMyProfile ? "/api/v1/user/me/match-history" : `/api/v1/user/${userId}/match-history`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const resJson = await response.json();

    const tbody = document.getElementById("historyTableBody")!;
    const noHistoryMsg = document.getElementById("noHistoryMessage")!;

    if (!response.ok || !resJson.success) {
      throw new Error(resJson.message || "Failed to load match history");
    }

    const matches = resJson.data;

    if (!matches || matches.length === 0) {
      tbody.innerHTML = "";
      noHistoryMsg.classList.remove("hidden");
      return;
    }

    noHistoryMsg.classList.add("hidden");
    tbody.innerHTML = "";
    for (const match of matches) {
      const playedAt = new Date(match.playedAt).toLocaleString();
      const opponent = (match.player1Name === this.username || this.isMyProfile && match.player1Id === undefined) ? match.player2Name : match.player1Name;
      const score = `${match.score1} - ${match.score2}`;
      const status = match.status || "";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="px-4 py-2 text-center">${playedAt}</td>
        <td class="px-4 py-2 text-center">${opponent}</td>
        <td class="px-4 py-2 text-center">${score}</td>
        <td class="px-4 py-2 text-center">${status}</td>
      `;
      tbody.appendChild(tr);
    }
  } catch (error: any) {
    alert(`Error loading match history: ${error.message || error}`);
  }


  }

}
