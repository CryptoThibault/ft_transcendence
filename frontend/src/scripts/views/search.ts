export class SearchView {
    async getHtml() {
		return `
      <div class="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- User List -->
    <div class="col-span-1">
      <!-- Search -->
      <div class="flex items-center space-x-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 30" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
        </svg>
        <input id="searchInput" type="text" class=" text-black w-full px-3 py-1 rounded bg-gray-200 outline-none" />
      </div>

      <!-- User Cards example -->
      <div id="userCards" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-4">
        <!-- User 1 -->
        <div data-username="Alex" class="user-card">
          <img src="./src/imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="user-avatar" />
          <div class="text-black  font-semibold">Alex </div>
          <div class="flex space-x-3 mt-2">
              <button data-i18n="add_friend" class="btn-add-friend">Add Friend</button>
              <button data-i18n="block" class="btn-block">Block</button>
          </div>          
        </div>
        <!-- User 2 -->
        <div data-username="Paul" class="user-card">
          <img src="./src/imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="user-avatar" />
          <div class="text-black  font-semibold">Paul </div>
          <div class="flex space-x-3 mt-2">
              <button data-i18n="remove_friend" class="btn-remove-friend">Remove Friend</button>
              <button data-i18n="block" class="btn-block">Block</button>
          </div>          
        </div>
        <!-- User 3 -->
        <div data-username="Marie" class="user-card">
          <img src="./src/imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="user-avatar" />
          <div class="text-black  font-semibold">Marie </div>
          <div class="flex space-x-3 mt-2">
              <button data-i18n="add_friend" class="btn-add-friend">Add Friend</button>
              <button data-i18n="block" class="btn-block">Block</button>
          </div>          
        </div>
      </div>
    </div>

  </div>
    `;

	}

  async onMounted() {
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    const userCards = document.querySelectorAll("#userCards > div");

    searchInput.addEventListener("input", () => {
        const filter = searchInput.value.toLowerCase();

        userCards.forEach(card => {
            const username = card.getAttribute("data-username") || "";
            if (username.toLowerCase().includes(filter)) {
                (card as HTMLElement).style.display = "flex";
            } else {
                (card as HTMLElement).style.display = "none";
            }
        });
    });
}
}