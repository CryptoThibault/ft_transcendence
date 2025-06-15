var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class PageNotFoundView {
    getHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
      <section class="flex flex-col items-center justify-center text-center p-10">
        <h2 class="text-3xl font-bold text-red-600">404 - Page Not Found</h2>
        <p class="mt-4 text-gray-700">Oops! The page you're looking for doesn't exist.</p>
        </section>
        `;
        });
    }
}
