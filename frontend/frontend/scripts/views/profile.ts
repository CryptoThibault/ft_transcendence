export class ProfileView{
    async getHtml() {
		return `
      <section class="bg-gray-100 max-w-5xl w-full mx-auto rounded-lg shadow-md p-4 sm:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
      
        <div class="flex flex-col items-center h-56">
            <div class="flex-grow"></div> 
            <img src="../imgs/9005ef6f70bb2a49db4c7c60e0185d3e.jpg" alt="Avatar" class="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow" />  
            <div class="flex-grow"></div>
            <button data-i18n="edit_profile" class="bg-blue-500 text-white px-4 py-1 rounded shadow hover:bg-blue-600 w-full max-w-xs mt-auto">
              Edit profile
            </button>
          </div>
          
      <!-- Info -->
      <div class="flex-1 bg-white rounded p-4 shadow space-y-4">
        <div>
          <label data-i18n="username" class="text-black text-left block font-semibold">Username</label>
          <input type="text" disabled value="abc123" class="w-full mt-1 p-2 rounded bg-gray-200  text-gray-600"/>
        </div>
        <div>
          <label class="text-black text-left block font-semibold">Email</label>
          <input type="text" disabled value="abc@gmail.com" class="w-full mt-1 p-2 rounded bg-gray-200  text-gray-600"/>
        </div>
        <div>
          <label data-i18n="password" class="text-black text-left block font-semibold">Password</label>
          <input type="password" disabled value="******" class="w-full mt-1 p-2 rounded bg-gray-200  text-gray-600"/>
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
    `;
	}
}