var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setupNavbar } from "./views/nav.js";
import { loadLanguage } from "./views/nav.js";
import { HomeView } from "./views/home.js";
import { LoginView } from "./views/login.js";
import { PageNotFoundView } from "./views/PageNotFound.js";
import { ProfileView } from "./views/profile.js";
import { SearchView } from "./views/search.js";
import { SignupView } from "./views/signup.js";
import { TournamentView } from "./views/tournament.js";
import { SinglePlayer } from "./views/singleplayer.js";
import { Multiplayer } from "./views/multiplayer.js";
let currentLanguage = "en";
export const setLanguage = (lang) => {
    currentLanguage = lang;
};
const routes = [
    { path: "/", view: HomeView },
    { path: "/login", view: LoginView },
    { path: "/signup", view: SignupView },
    { path: "/profile", view: ProfileView, protected: true },
    { path: "/search", view: SearchView, protected: true },
    { path: "/singleplayer", view: SinglePlayer },
    { path: "/multiplayer", view: Multiplayer },
    { path: "/tournament", view: TournamentView },
];
export const navigateTo = (url) => {
    history.pushState(null, "", url);
    router();
};
const router = () => __awaiter(void 0, void 0, void 0, function* () {
    const location = window.location;
    const pathRegax = /^\/profile\/([^/]+)$/;
    const matchRegex = location.pathname.match(pathRegax);
    if (matchRegex) {
        const username = matchRegex[1];
        const profileView = new ProfileView(username);
        document.querySelector("#mainContent").innerHTML = yield profileView.getHtml();
        if (typeof profileView.onMounted === "function") {
            yield profileView.onMounted();
        }
        setupNavbar();
        setupLogoutHandler();
        loadLanguage(currentLanguage);
        return;
    }
    const potentialMatches = routes.map(route => ({
        route,
        isMatch: location.pathname === route.path,
    }));
    let match = potentialMatches.find(p => p.isMatch);
    if (!match) {
        const view = new PageNotFoundView();
        document.querySelector("body").innerHTML = yield view.getHtml();
        return;
    }
    if (match.route.protected && !localStorage.getItem("token")) {
        navigateTo("/login");
        return;
    }
    const view = new match.route.view();
    document.querySelector("#mainContent").innerHTML = yield view.getHtml();
    if (typeof view.onMounted === "function") {
        yield view.onMounted();
    }
    setupNavbar();
    setupLogoutHandler();
    loadLanguage(currentLanguage);
});
const setupLogoutHandler = () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            navigateTo("/");
        });
    }
};
window.addEventListener("popstate", router);
window.loadLanguage = loadLanguage;
document.addEventListener("DOMContentLoaded", () => {
    loadLanguage(currentLanguage);
    document.body.addEventListener("click", e => {
        const target = e.target;
        const link = target.closest("[data-link]");
        if (link) {
            e.preventDefault();
            const path = link.getAttribute("href") || link.getAttribute("data-link");
            if (path) {
                navigateTo(path);
            }
        }
    });
    router();
});
