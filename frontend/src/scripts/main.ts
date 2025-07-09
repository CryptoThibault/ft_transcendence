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

declare global {
	interface Window {
		GOOGLE_CLIENT_ID: string;
		google: any;
	}

	interface ImportMeta {
		env: any;
	}
}
window.GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

type Route = {
	path: string;
	view: any;
	protected?: boolean;
};

let currentLanguage = "en";

export const setLanguage = (lang: string) => {
	currentLanguage = lang;
};

const routes: Route[] = [
	{ path: "/", view: HomeView },
	{ path: "/login", view: LoginView },
//	{ path: "/login", view: () => new LoginView(import.meta.env.VITE_GOOGLE_CLIENT_ID) },
	{ path: "/signup", view: SignupView },
	{ path: "/profile", view: ProfileView, protected: true },
	{ path: "/search", view: SearchView, protected: true },
	{path: "/singleplayer", view: SinglePlayer},
	{path: "/multiplayer", view: Multiplayer},
	{path: "/tournament", view: TournamentView},
];

export const navigateTo = (url: string) => {
	history.pushState(null, "", url);
	router();
};

const router = async () => {
    const location = window.location;
    const pathRegax = /^\/profile\/([^/]+)$/;
    const matchRegex = location.pathname.match(pathRegax);

    if (matchRegex) {
        const username = matchRegex[1];
        const profileView = new ProfileView(username, false);
        document.querySelector("#mainContent")!.innerHTML = await profileView.getHtml();
        if (typeof profileView.onMounted === "function") {
            await profileView.onMounted();
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
        document.querySelector("body")!.innerHTML = await view.getHtml();
        return;
    }

    if (match.route.protected && !localStorage.getItem("token")) {
        navigateTo("/login");
        return;
    }

    const view = new match.route.view();
    document.querySelector("#mainContent")!.innerHTML = await view.getHtml();

    if (typeof view.onMounted === "function") {
        await view.onMounted();
    }

    setupNavbar();
    setupLogoutHandler();

    loadLanguage(currentLanguage);
};

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
(window as any).loadLanguage = loadLanguage;

document.addEventListener("DOMContentLoaded", () => {
	loadLanguage(currentLanguage);
	document.body.addEventListener("click", e => {

		const target = e.target as HTMLElement;
		const link = target.closest("[data-link]") as HTMLElement | null;
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