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
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
        </svg>
        <input type="text" placeholder="search" class=" text-black w-full px-3 py-1 rounded bg-gray-200 outline-none" />
      </div>

      <!-- User Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-4">
        <!-- User 1 -->
        <div onclick="openChat('test1')" class="bg-white w-full h-40 rounded p-2 shadow text-center cursor-pointer flex flex-col items-center justify-center">
          <img src="../imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="w-16 h-16 object-cover rounded-full mb-2" />
          <div class="text-black text-sm font-semibold">test1 <span class="italic text-gray-500">Chat</span></div>
        </div>
        <!-- User 2 -->
        <div onclick="openChat('user2')" class="bg-white w-full h-40 rounded p-2 shadow text-center cursor-pointer flex flex-col items-center justify-center">
          <img src="../imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="w-16 h-16 object-cover rounded-full mb-2" />
          <div class="text-black text-sm font-semibold">user2 <span class="italic text-gray-500">Chat</span></div>
        </div>
        <!-- User 3 -->
        <div onclick="openChat('user3')" class="bg-white w-full h-40 rounded p-2 shadow text-center cursor-pointer flex flex-col items-center justify-center">
          <img src="../imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="avatar" class="w-16 h-16 object-cover rounded-full mb-2" />
          <div class="text-black text-sm font-semibold">user3 <span class="italic text-gray-500">Chat</span></div>
        </div>
      </div>
    </div>

    <!-- Chat Box -->
    <div class="col-span-1 sm:col-span-2 hidden" id="chatBox">
      <div class="bg-white rounded shadow flex flex-col h-[500px]">
        <!-- Header -->
        <div class="bg-gray-100 px-4 py-2 font-mono text-sm border-b flex justify-between items-center">
          🗨 <span id="chatWith">user1</span>
          <button onclick="closeChat()" class="text-gray-500 hover:text-red-500 text-sm">✖ Close</button>
        </div>
        <!-- Chat content -->
        <div class="flex-1 overflow-y-auto p-4 bg-gray-200">
          <p class="text-gray-700">This is the beginning of your chat.</p>
        </div>
        <!-- Input -->
        <div class="border-t p-2 bg-white">
          <input type="text" placeholder="Type..." class="w-full px-3 py-2 rounded bg-gray-100 outline-none" />
        </div>
      </div>
    </div>
  </div>
    `;
        });
    }
}
