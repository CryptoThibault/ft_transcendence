var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class LoginView {
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
      <h2 class="header_custom" data-i18n="login_pong_42">Login Pong 42</h2>
        <form class="flex flex-col space-y-8 w-80">
            <label class="text-black font-semibold text-left" data-i18n="username">Username:</label>
            <input type="text" placeholder="abc123" class="px-3 py-2 rounded bg-gray-200 text-gray-700" />
      
            <label class="text-black font-semibold text-left mt-4" data-i18n="password">Password:</label>
            <input type="password" placeholder="******" class="px-3 py-2 rounded bg-gray-200 text-gray-700" />
      
            <button class="bg-blue-600 font-bold text-white py-2 rounded hover:bg-blue-800 transition-all font-mono" data-link data-i18n="login">Login</button>
            <button class="bg-black font-bold text-white py-2 rounded hover:bg-gray-700 transition-all font-mono" data-i18n="login_gg">Login with Google</button>
          </form>
    `;
        });
    }
}
