import { navigateTo } from "../main.js";
import { io, Socket } from "../../../node_modules/socket.io-client/build/esm/index.js";
export let tournamentNicknames: string[] = ["Player 1", "Player 2", "Player 3", "Player 4"];

export let multiNicknames: string[] = ["Player 1", "Player 2"];

export class HomeView {
	async getHtml() {
		return `
      <h2 class="header_custom" data-i18n="welcome">Welcome to Pong42</h2>

	  <div class="flex flex-col sm:flex-row gap-8">
		<a href="/singleplayer" data-link class="btn-gamemode" data-i18n="singleplayer">
			Single player
		</a>
		<button id="multiPlayerBtn" class="btn-gamemode" data-i18n="multiplayer"">
			Multiplayer
		</button>
		<button id="tournamentBtn" class="btn-gamemode" data-i18n="tournament">
			Tournament
		</button>
	  </div>

	  <!-- Tournament Popup -->
	  <div id="tournamentPopup" class="fixed inset-0 items-center justify-center bg-black/50 backdrop-blur-sm hidden z-50">
		<div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
			<h3 data-i18n="tournament_players" class=" text-black text-lg mb-4">Tournament Players</h3>

			
			<div id="nicknameInputs" class="flex flex-col gap-2 mb-4"></div>
			<div class="flex justify-end gap-2">
				<button data-i18n="cancel" id="cancelPopup" class="px-4 py-2 bg-gray-500 rounded hover:bg-gray-800">Cancel</button>
				<button data-i18n="start" id="startTournament" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-950">Start</button>
			</div>
		</div>
	  </div>


	  <!-- Multiplayer Popup -->
		<div id="multiPlayerPopup" class="fixed inset-0 items-center justify-center bg-black/50 backdrop-blur-sm hidden z-50">
		<div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
			<h3 data-i18n="multi_players" class=" text-black text-lg mb-4">Players</h3>

			
			<div id="nicknameMultiInputs" class="flex flex-col gap-2 mb-4"></div>
			<div class="flex justify-end gap-2">
				<button data-i18n="cancel" id="cancelMultiPopup" class="px-4 py-2 bg-gray-500 rounded hover:bg-gray-800">Cancel</button>
				<button data-i18n="start" id="startMulti" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-950">Start</button>
			</div>
		</div>
	  </div>
    `;
	}

	async onMounted() {
  const liveChatToggleBtn = document.getElementById("liveChatToggleBtn")!;
  const liveChatPanel = document.getElementById("liveChatPanel")!;
  const friendsList = document.getElementById("friendsList")!;
  const chatContainer = document.getElementById("chatContainer")!;
  const backToFriendsBtn = document.getElementById("backToFriendsBtn")!;
  const chatMessages = document.getElementById("chatMessages")!;
  const chatInput = document.getElementById("chatInput")! as HTMLInputElement;

  function updateUIBasedOnToken() {
  const token = localStorage.getItem("token");
  const liveChatToggleBtn = document.getElementById("liveChatToggleBtn");
  if (!token && liveChatToggleBtn) {
    liveChatToggleBtn.style.display = "none";
  } else if (liveChatToggleBtn) {
    liveChatToggleBtn.style.display = "block";
  }
}
  updateUIBasedOnToken()
  const token = localStorage.getItem("token"); 


  let socket: Socket
  if (token)
  {
	  socket = io("/", {
		auth: {
		  token: token,
		},
	  });
	  console.log(socket.active)
	  socket.on("get-chat-message", ({ from, msg }: { from: string; msg: string }) => {
          console.log("I got a message")
		

          const item = document.createElement("li");
          item.textContent = `${from}: ${msg}`;
          chatMessages.appendChild(item);
          window.scrollTo(0, document.body.scrollHeight);
        });

  }
  async function getFriendsList() {
		try {
			if (!token)
			{
				throw Error('No token')
			}

			const response = await fetch("/api/v1/user/me/friends", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
			},
			});

			if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to fetch friends");
			}

			const friends = await response.json();
			return friends;

		} catch (error) {
			throw error;
		}
  }	
  // Toggle panel visibility
liveChatToggleBtn.addEventListener("click", async () => {
	if (!token)
		return;
  if (liveChatPanel.style.transform === "translateX(0%)") {
    liveChatPanel.style.transform = "translateX(-100%)";
    showFriendsList();
	
  } else {
    liveChatPanel.style.transform = "translateX(0%)";

    try {
      const friendsRes = await getFriendsList();
	  let friends = friendsRes.data 
	  if (friends)
      	renderFriends(friends);
    } catch (error: any) {
      friendsList.style.display = "none";
      chatContainer.style.display = "flex";
      chatMessages.innerHTML = `<div style="color:red;">Error: ${error.message}</div>`;
    }
  }
});

  // Render friends list
  
function renderFriends(friends: Array<{ id: number; name: string }>) {
  friendsList.innerHTML = "";
  friends.forEach(friend => {
    const li = document.createElement("li");
    li.textContent = friend.name;
    li.style.padding = "10px";
    li.style.cursor = "pointer";
    li.style.borderBottom = "1px solid #eee";

    li.addEventListener("click", () => {
      openChat(friend);
    });

    friendsList.appendChild(li);
  });
}

  function showFriendsList() {
    friendsList.style.display = "block";
    chatContainer.style.display = "none";
  }

  function openChat(friend: { id: number; name: string }) {
    friendsList.style.display = "none";
    chatContainer.style.display = "flex";
    chatMessages.innerHTML = `<div>Chatting with <b>${friend.name}</b></div>`;
    chatInput.value = "";
    chatInput.focus();

    // For demo: handle sending messages and showing them in chatMessages
    const onSend = (e: KeyboardEvent) => {
      if (e.key === "Enter" && chatInput.value.trim() !== "") {
        const msg = chatInput.value.trim();
        const messageDiv = document.createElement("div");
        messageDiv.textContent = `You: ${msg}`;
        chatMessages.appendChild(messageDiv);
		socket.emit("emit-chat-message", {
              to: friend.name,
              msg: chatInput.value
            });
        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    };

    chatInput.removeEventListener("keydown", onSend);
    chatInput.addEventListener("keydown", onSend);
  }

  backToFriendsBtn.addEventListener("click", () => {
    showFriendsList();
  });

  //renderFriends(friends);
  // Initially hide panel
  liveChatPanel.style.transform = "translateX(-100%)";


		//handle tournament popup
		const tournamentBtn = document.getElementById("tournamentBtn")!;
		const tournamentPopup = document.getElementById("tournamentPopup")!;
		const nicknameInputs = document.getElementById("nicknameInputs")!;
		const cancelPopup = document.getElementById("cancelPopup")!;
		const startBtn = document.getElementById("startTournament")!;
		const mainContent = document.getElementById("mainContent")!;

		tournamentBtn.addEventListener("click", () => {
			tournamentPopup.classList.remove("hidden");
			tournamentPopup.classList.add("flex");
			nicknameInputs.textContent = "";

			Array.from({ length: 4 }).forEach((_, i) => {
				const label = document.createElement("label");
				label.textContent = `Player ${i + 1}`;
				label.className = "text-black text-left mb-1 block text-md leading-snug";

				const input = document.createElement("input");
				input.type = "text";
				input.id = `TournamentNickname${i}`;
				input.className = "text-black p-2 border rounded mb-3 block w-full";

				nicknameInputs.appendChild(label);
				nicknameInputs.appendChild(input);
			});
		});

		cancelPopup.addEventListener("click", () => {
			tournamentPopup.classList.add("hidden");
			mainContent.classList.remove("blur-sm", "pointer-events-none", "select-none");
		});

		startBtn.addEventListener("click", () => {
			const count = 4;
			const inputs = Array.from({ length: count }).map((_, i) => {
				const input = document.getElementById(`TournamentNickname${i}`) as HTMLInputElement;
				return input.value.trim() || `Player ${i + 1}`;
			});
			for (let i = 0; i < inputs.length; i++) {
				if (inputs[i].length > 8) {
					alert(`Nickname for Player ${i + 1} is too long (max 8 characters).`);
					return;
				}
			}
			const nicknameSet = new Set(inputs);
			if (nicknameSet.size !== inputs.length) {
				alert("Nicknames must be unique.");
				return;
			}
		
			tournamentNicknames = inputs;
			tournamentPopup.classList.add("hidden");
			navigateTo("/tournament");
		});

		//handle multiplayer popup
		const multiBtn = document.getElementById("multiPlayerBtn")!;
		const multiPopup = document.getElementById("multiPlayerPopup")!;
		const nicknameMultiInputs = document.getElementById("nicknameMultiInputs")!;
		const cancelMultiPopup = document.getElementById("cancelMultiPopup")!;
		const startMulti = document.getElementById("startMulti")!;

		multiBtn.addEventListener("click", () => {
			multiPopup.classList.remove("hidden");
			multiPopup.classList.add("flex");
			nicknameMultiInputs.textContent = "";

			for (let i = 0; i < 2; i++) {
				const label = document.createElement("label");
				label.textContent = `Player ${i + 1}`;
				label.className = "text-black text-left mb-1 block text-md leading-snug";

				const input = document.createElement("input");
				input.type = "text";
				input.id = `multiNickname${i}`;
				input.className = "text-black p-2 border rounded mb-3 block w-full";

				nicknameMultiInputs.appendChild(label);
				nicknameMultiInputs.appendChild(input);
			}
		});

		cancelMultiPopup.addEventListener("click", () => {
			multiPopup.classList.add("hidden");
			mainContent.classList.remove("blur-sm", "pointer-events-none", "select-none");
		});

		startMulti.addEventListener("click", () => {
			const count = 2;
			const nicknames = Array.from({ length: count }).map((_, i) => {
			  const input = document.getElementById(`multiNickname${i}`) as HTMLInputElement;
			  return input.value.trim() || `Player ${i + 1}`;
			});

			for (let i = 0; i < count; i++) {
			  if (nicknames[i].length > 8) {
				alert(`Player ${i + 1} nickname is too long (max 8 characters)`);
				return;
			  }
			}

			const uniqueNames = new Set(nicknames);
			if (uniqueNames.size !== nicknames.length) {
			  alert("Player's nicknames must be unique!");
			  return;
			}
			multiNicknames = nicknames;
			multiPopup.classList.add("hidden");
			navigateTo("/multiplayer");
		  });
	}
}
