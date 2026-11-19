const membershipLabels = {
    1: "Member",
    2: "Silver member",
    3: "Gold member",
};

export async function fetchMembers() {
    const url = new URL("../data/members.json", import.meta.url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Member directory request failed (${response.status})`);
    }
    return response.json();
}

export function createMemberCard(member) {
    const card = document.createElement("article");
    card.className = "member-card";
    card.innerHTML = `
        <div class="member-heading">
            <img alt="" width="56" height="56" loading="lazy">
            <div>
                <h3></h3>
                <p class="member-level"></p>
            </div>
        </div>
        <address class="member-contact">
            <span></span>
            <span></span>
            <a>Visit website</a>
        </address>`;

    card.querySelector("img").src = new URL(`../images/${member.image}`, import.meta.url);
    card.querySelector("h3").textContent = member.name;
    card.querySelector(".member-level").textContent = membershipLabels[member.membershipLevel];
    const [address, phone] = card.querySelectorAll("address span");
    address.textContent = member.address;
    phone.textContent = member.phone;
    const website = card.querySelector("address a");
    website.href = member.website;
    website.setAttribute("aria-label", `Visit website for ${member.name}`);
    return card;
}
