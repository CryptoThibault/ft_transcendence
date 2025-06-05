export class LoginView {
    async getHtml() {
		return `
      <h2 class="header_custom mt-20 mb-20" data-i18n="login_pong_42">Login Pong 42</h2>
        <form class="flex flex-col space-y-8 w-80">
            <label class="text-black font-semibold text-left" data-i18n="username">Username:</label>
            <input type="text" placeholder="abc123" class="px-3 py-2 rounded bg-gray-200 text-gray-700" />
      
            <label class="text-black font-semibold text-left mt-4" data-i18n="password">Password:</label>
            <input type="password" placeholder="******" class="px-3 py-2 rounded bg-gray-200 text-gray-700" />
      
            <button class="bg-blue-600 font-bold text-white py-2 rounded hover:bg-blue-800 transition-all font-mono" data-link data-i18n="login">Login</button>
            <button class="bg-black font-bold text-white py-2 rounded hover:bg-gray-700 transition-all font-mono" data-i18n="login_gg">Login with Google</button>
          </form>
    `;
	}
}