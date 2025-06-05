export class SignupView {
    async getHtml() {
		return `
      <h2 class="header_custom mb-20 mt-20" data-i18n="welcome">Welcome to Pong42</h2>
        <p class="text-lg mb-10 font-semibold text-black" data-i18n="create_new_ac">Create new account:</p>

    <form class="flex flex-col space-y-4 w-80">
      <div>
        <label for="username" class="block text-black font-semibold text-left w-full" data-i18n="username">Username</label>
        <input id="username" type="text" placeholder="abc123" class="w-full px-3 py-2 rounded bg-gray-200 text-gray-700" />
      </div>

      <div>
        <label for="email" class="block text-black font-semibold text-left w-full">Email</label>
        <input id="email" type="email" placeholder="alex@gmail.com" class="w-full px-3 py-2 rounded bg-gray-200 text-gray-700" />
      </div>

      <div>
        <label for="password" class="block text-black font-semibold text-left w-full" data-i18n="password">Password</label>
        <input id="password" type="password" placeholder="******" class="w-full px-3 py-2 rounded bg-gray-200 text-gray-700" />
      </div>

      <div>
        <label for="confirm" class="block text-black font-semibold text-left w-full" data-i18n="cf_password">Confirm password</label>
        <input id="confirm" type="password" placeholder="******" class="w-full px-3 py-2 rounded bg-gray-200 text-gray-700" />
      </div>

      <button
        type="submit"
        class="mt-2 bg-black text-white py-2 rounded font-bold hover:bg-gray-800 transition-all" data-i18n="register">
        Register
      </button>
    </form>
    `;
	}
}