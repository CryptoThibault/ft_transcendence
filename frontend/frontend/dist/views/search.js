var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class SearchView {
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
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
        <div data-username="Alex" class="bg-white w-full h-40 rounded p-2 shadow text-center cursor-pointer flex flex-col items-center justify-center">
          <img src="../imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="w-16 h-16 object-cover rounded-full mb-2" />
          <div class="text-black text-md font-semibold">Alex </div>
          <div class="flex space-x-3 mt-2">
              <button data-i18n="add_friend" class="text-md px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-950">Add Friend</button>
              <button data-i18n="block" class="text-md px-4 py-2 bg-gray-500 rounded hover:bg-gray-800">Block</button>
          </div>          
        </div>
        <!-- User 2 -->
        <div data-username="Paul" class="bg-white w-full h-40 rounded p-2 shadow text-center cursor-pointer flex flex-col items-center justify-center">
          <img src="../imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="w-16 h-16 object-cover rounded-full mb-2" />
          <div class="text-black text-md font-semibold">Paul </div>
          <div class="flex space-x-3 mt-2">
              <button data-i18n="remove_friend" class="text-md px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-950">Remove Friend</button>
              <button data-i18n="block" class="text-md px-4 py-2 bg-gray-500 rounded hover:bg-gray-800">Block</button>
          </div>          
        </div>
        <!-- User 3 -->
        <div data-username="Marie" class="bg-white w-full h-40 rounded p-2 shadow text-center cursor-pointer flex flex-col items-center justify-center">
          <img src="../imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="w-16 h-16 object-cover rounded-full mb-2" />
          <div class="text-black text-md font-semibold">Marie </div>
          <div class="flex space-x-3 mt-2">
              <button data-i18n="add_friend" class="text-md px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-950">Add Friend</button>
              <button data-i18n="block" class="text-md px-4 py-2 bg-gray-500 rounded hover:bg-gray-800">Block</button>
          </div>          
        </div>
      </div>
    </div>

  </div>
    `;
        });
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const searchInput = document.getElementById("searchInput");
            const userCards = document.querySelectorAll("#userCards > div");
            searchInput.addEventListener("input", () => {
                const filter = searchInput.value.toLowerCase();
                userCards.forEach(card => {
                    const username = card.getAttribute("data-username") || "";
                    if (username.toLowerCase().includes(filter)) {
                        card.style.display = "flex";
                    }
                    else {
                        card.style.display = "none";
                    }
                });
            });
        });
    }
}
