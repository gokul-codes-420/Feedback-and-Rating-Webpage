document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedbackForm");
    const feedbackList = document.getElementById("feedbackList");
    const averageRatingText = document.getElementById("averageRating");
    const starRatingContainer = document.getElementById("starRating");
    const ratingInput = document.getElementById("rating");
    const stars = starRatingContainer.querySelectorAll(".star");

    const feedbackArray = [];

    // Star Rating Logic
    stars.forEach(star => {
        star.addEventListener("click", () => {
            const value = star.getAttribute("data-value");
            ratingInput.value = value;
            updateStars(value);
        });

        star.addEventListener("mouseover", () => {
            const value = star.getAttribute("data-value");
            highlightStars(value);
        });

        star.addEventListener("mouseout", () => {
            updateStars(ratingInput.value);
        });
    });

    function highlightStars(value) {
        stars.forEach(s => {
            s.classList.toggle("active", s.getAttribute("data-value") <= value);
        });
    }

    function updateStars(value) {
        stars.forEach(s => {
            s.classList.toggle("active", s.getAttribute("data-value") <= value);
        });
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const rating = ratingInput.value;
        const comments = document.getElementById("comments").value.trim();

        // Reset errors
        document.querySelectorAll(".error").forEach(err => err.textContent = "");

        let isValid = true;

        if (name === "") {
            document.getElementById("nameError").textContent = "Full name is required";
            isValid = false;
        }
        if (email === "" || !/^\S+@\S+\.\S+$/.test(email)) {
            document.getElementById("emailError").textContent = "Please enter a valid email address";
            isValid = false;
        }
        if (rating === "") {
            document.getElementById("ratingError").textContent = "Please select a rating";
            isValid = false;
        }
        if (comments.length < 10) {
            document.getElementById("commentsError").textContent = "Please share at least 10 characters";
            isValid = false;
        }

        if (!isValid) return;

        const feedback = { 
            name, 
            email, 
            rating: Number(rating), 
            comments,
            date: new Date().toLocaleDateString()
        };
        
        feedbackArray.unshift(feedback); // Newest first

        displayFeedback();
        updateAverageRating();
        form.reset();
        updateStars(0);
        ratingInput.value = "";
    });

    function getStarsHTML(rating) {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }

    function displayFeedback() {
        feedbackList.innerHTML = "";

        feedbackArray.forEach((fb, index) => {
            const div = document.createElement("div");
            div.className = "feedback-item";
            div.innerHTML = `
                <div class="feedback-header">
                    <div class="user-info">
                        <span class="user-name">${fb.name}</span>
                        <span class="user-email">${fb.email}</span>
                    </div>
                    <div class="item-stars">${getStarsHTML(fb.rating)}</div>
                </div>
                <p class="item-comment">${fb.comments}</p>
                <button class="delete-btn" data-index="${index}">Delete Feedback</button>
            `;
            feedbackList.appendChild(div);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                deleteFeedback(index);
            });
        });
    }

    function deleteFeedback(index) {
        feedbackArray.splice(index, 1);
        displayFeedback();
        updateAverageRating();
    }

    function updateAverageRating() {
        const total = feedbackArray.reduce((sum, fb) => sum + fb.rating, 0);
        const avg = feedbackArray.length ? (total / feedbackArray.length).toFixed(2) : "0.00";
        averageRatingText.textContent = `Average Rating: ${avg} / 5`;
    }
});