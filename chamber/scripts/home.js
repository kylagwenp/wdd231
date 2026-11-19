import { createMemberCard, fetchMembers } from "./members.js";
import { showWeather } from "./weather.js";

async function showSpotlights() {
    const status = document.querySelector("#spotlight-status");
    try {
        const members = await fetchMembers();
        const eligible = members.filter(({ membershipLevel }) => membershipLevel === 2 || membershipLevel === 3);

        // Fisher–Yates shuffle gives each eligible member the same chance to appear.
        for (let index = eligible.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [eligible[index], eligible[randomIndex]] = [eligible[randomIndex], eligible[index]];
        }

        document.querySelector("#spotlights").replaceChildren(...eligible.slice(0, 3).map(createMemberCard));
        status.textContent = eligible.length ? "" : "No featured members are available.";
    } catch {
        status.textContent = "Featured members are temporarily unavailable.";
    }
}

showSpotlights();
showWeather();
