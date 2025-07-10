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
  let selectedFriend = ""
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
		
		  if (from == selectedFriend)
		  {
			const item = document.createElement("li");
			item.textContent = `${from}: ${msg}`;
			chatMessages.appendChild(item);
			window.scrollTo(0, document.body.scrollHeight);
		  }
        });

        socket.on("game-invitation-with-buttons", ({ from, invitationId, message, roomName }: { from: string; invitationId: string; message: string; roomName: string }) => {
            console.log("Received game invitation with buttons");
            
            if (from === selectedFriend) {
                const invitationDiv = document.createElement("div");
                invitationDiv.className = "game-invitation";
                invitationDiv.setAttribute("data-invitation-id", invitationId);
                invitationDiv.style.cssText = `
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                `;
                
                const messageDiv = document.createElement("div");
                messageDiv.textContent = message;
                messageDiv.style.marginBottom = "10px";
                messageDiv.style.fontWeight = "bold";
                
                const roomDiv = document.createElement("div");
                roomDiv.textContent = `Room: ${roomName}`;
                roomDiv.style.fontSize = "12px";
                roomDiv.style.opacity = "0.8";
                roomDiv.style.marginBottom = "10px";
                
                const buttonContainer = document.createElement("div");
                buttonContainer.style.display = "flex";
                buttonContainer.style.gap = "10px";
                
                const acceptBtn = document.createElement("button");
                acceptBtn.textContent = "Accept";
                acceptBtn.style.cssText = `
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                `;
                
                const declineBtn = document.createElement("button");
                declineBtn.textContent = "Decline";
                declineBtn.style.cssText = `
                    background: #f44336;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                `;
                
                acceptBtn.onclick = () => {
                    console.log(`Accepting invitation ${invitationId}`);
                    socket.emit('accept-game-invitation', { invitationId });
                    invitationDiv.remove();
                };
                
                declineBtn.onclick = () => {
                    console.log(`Declining invitation ${invitationId}`);
                    socket.emit('decline-game-invitation', { invitationId });
                    invitationDiv.remove();
                };
                
                buttonContainer.appendChild(acceptBtn);
                buttonContainer.appendChild(declineBtn);
                
                invitationDiv.appendChild(messageDiv);
                invitationDiv.appendChild(roomDiv);
                invitationDiv.appendChild(buttonContainer);
                
                chatMessages.appendChild(invitationDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });

        socket.on("game-invitation-response", ({ from, accepted, message }: { from: string; accepted: boolean; message: string }) => {
            console.log("Received game invitation response");
            
            const responseDiv = document.createElement("div");
            responseDiv.style.cssText = `
                background: ${accepted ? '#4CAF50' : '#f44336'};
                color: white;
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
                text-align: center;
                font-weight: bold;
            `;
            responseDiv.textContent = message;
            
            chatMessages.appendChild(responseDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });

        socket.on("game-start", ({ roomName, opponent, message }: { roomName: string; opponent: string; message: string }) => {
            console.log("Game starting!");
            console.log("Room name:", roomName);
            console.log("Opponent:", opponent);
            
            const startDiv = document.createElement("div");
            startDiv.style.cssText = `
                background: #2196F3;
                color: white;
                padding: 15px;
                margin: 10px 0;
                border-radius: 5px;
                text-align: center;
                font-weight: bold;
            `;
            startDiv.textContent = message;
            
            chatMessages.appendChild(startDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            setTimeout(() => {
                console.log(`Navigating to /online-game/${roomName}`);
                navigateTo(`/online-game/${roomName}`);
            }, 2000);
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

    async function getMessageHistory(selectedFriendName: string) {
		try {
			if (!token)
			{
				throw Error('No token')
			}

			const response = await fetch(`/livechat/api/messages/${selectedFriendName}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
			},
			});

			if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to get message history");
			}
			const messages = await response.json();
			return messages;

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
	  let friends = friendsRes.data.accepted
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
	  selectedFriend = friend.name
    });

    friendsList.appendChild(li);
  });
}

  function showFriendsList() {
    friendsList.style.display = "block";
    chatContainer.style.display = "none";
  }

  async function openChat(friend: { id: number; name: string }) {
    friendsList.style.display = "none";
    chatContainer.style.display = "flex";
    chatMessages.innerHTML = `<div>Chatting with <b>${friend.name}</b></div>`;
    chatInput.value = "";
    chatInput.focus();

	const messages = await getMessageHistory(friend.name);
	//TO-DO message type
	messages.forEach((message: any) => {
		const oldMsg = message.message
		const sender = message.sender_id == friend.name ? friend.name : "You:"
		
		try {
			const parsedMsg = JSON.parse(oldMsg);
			if (parsedMsg.type === 'accepted_game') {
				// Create a special message for accepted games
				const gameMessageDiv = document.createElement("div");
				gameMessageDiv.style.cssText = `
					background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
					color: white;
					padding: 15px;
					margin: 10px 0;
					border-radius: 10px;
					box-shadow: 0 4px 6px rgba(0,0,0,0.1);
				`;
				
				const gameInfoDiv = document.createElement("div");
				gameInfoDiv.textContent = `Game accepted! Room: ${parsedMsg.roomName}`;
				gameInfoDiv.style.marginBottom = "10px";
				gameInfoDiv.style.fontWeight = "bold";
				
				const rejoinBtn = document.createElement("button");
				rejoinBtn.textContent = "Rejoin Game";
				rejoinBtn.style.cssText = `
					background: #2196F3;
					color: white;
					border: none;
					padding: 8px 16px;
					border-radius: 5px;
					cursor: pointer;
					font-weight: bold;
				`;
				rejoinBtn.onmouseover = () => rejoinBtn.style.background = "#1976D2";
				rejoinBtn.onmouseout = () => rejoinBtn.style.background = "#2196F3";
				
				rejoinBtn.onclick = () => {
					console.log(`Rejoining game in room: ${parsedMsg.roomName}`);
					navigateTo(`/online-game/${parsedMsg.roomName}`);
				};
				
				gameMessageDiv.appendChild(gameInfoDiv);
				gameMessageDiv.appendChild(rejoinBtn);
				chatMessages.appendChild(gameMessageDiv);
			} else {
				// Regular message
				const messageDiv = document.createElement("div");
				messageDiv.textContent = `${sender}: ${oldMsg}`;
				chatMessages.appendChild(messageDiv);
			}
		} catch (e) {
			// Not a JSON message, treat as regular message
			const messageDiv = document.createElement("div");
			messageDiv.textContent = `${sender}: ${oldMsg}`;
			chatMessages.appendChild(messageDiv);
		}
		chatMessages.scrollTop = chatMessages.scrollHeight;
	});
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
	selectedFriend = ""
  });



  //renderFriends(friends);

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