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

document.fonts.load("16px 'Press Start 2P'");

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
	{ path: "/signup", view: SignupView },
	{ path: "/profile", view: ProfileView, protected: true },
	{ path: "/search", view: SearchView, protected: true },
	{path: "/singleplayer", view: SinglePlayer},
	{path: "/multiplayer", view: Multiplayer},
	{path: "/tournament", view: TournamentView},

];

//using for test logged in interface
const isLoggedIn = (): boolean => {
	return localStorage.getItem("loggedIn") === "true";
};

export const navigateTo = (url: string) => {
	history.pushState(null, "", url);
	router();
};

const router = async () => {
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

	if (match.route.protected && !isLoggedIn()) {
		navigateTo("/login");
		return;
	}

  // if (isLoggedIn() && ["/login", "/signup"].includes(match.route.path)) {
  //   localStorage.setItem("loggedIn", "false");
  // }

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
			localStorage.setItem("loggedIn", "false");
			navigateTo("/login");
		});
	}
};

window.addEventListener("popstate", router);

(window as any).loadLanguage = loadLanguage;


document.addEventListener("DOMContentLoaded", () => {
	localStorage.setItem("loggedIn", "true");
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