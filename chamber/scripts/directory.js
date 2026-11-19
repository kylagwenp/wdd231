import { createMemberCard, fetchMembers } from "./members.js";

const directory = document.querySelector("#members");
const status = document.querySelector("#directory-status");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

function setListView(useList) {
    directory.classList.toggle("is-list", useList);
    gridButton.setAttribute("aria-pressed", String(!useList));
    listButton.setAttribute("aria-pressed", String(useList));
}

gridButton.addEventListener("click", () => setListView(false));
listButton.addEventListener("click", () => setListView(true));

try {
    const members = await fetchMembers();
    directory.replaceChildren(...members.map(createMemberCard));
    status.textContent = members.length ? "" : "No members are listed yet.";
} catch {
    status.textContent = "The member directory is temporarily unavailable.";
}
