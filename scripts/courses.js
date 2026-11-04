const courseList = document.querySelector("#course-list");
const creditTotal = document.querySelector("#credit-total");
const filterButtons = document.querySelectorAll(".course-filters button");

function showCourses(subject) {
    const visibleCourses = subject === "all"
        ? courses
        : courses.filter(course => course.subject === subject);

    courseList.replaceChildren();

    visibleCourses.forEach(course => {
        const card = document.createElement("div");
        card.classList.add("course-card");
        card.textContent = `${course.subject} ${course.number} — ${course.title}`;

        if (course.completed) {
            card.classList.add("completed");
            card.textContent += " ✓ Completed";
        }

        courseList.append(card);
    });

    const total = visibleCourses.reduce((sum, course) => sum + course.credits, 0);
    creditTotal.textContent = `Total credits for the courses shown: ${total}`;
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(filterButton => {
            filterButton.setAttribute("aria-pressed", String(filterButton === button));
        });

        showCourses(button.dataset.filter);
    });
});

showCourses("all");