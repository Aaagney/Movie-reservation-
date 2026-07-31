// ==========================================================
// CONFIGURATION
// ==========================================================
const API_BASE_URL = "http://localhost:3000/movies";

// ==========================================================
// DOM ELEMENT REFERENCES
// ==========================================================
const movieGrid = document.getElementById("movieGrid");
const loadingSpinner = document.getElementById("loadingSpinner");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

const addMovieBtn = document.getElementById("addMovieBtn");
const movieModal = document.getElementById("movieModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const movieForm = document.getElementById("movieForm");
const modalTitle = document.getElementById("modalTitle");

const movieIdInput = document.getElementById("movieId");
const titleInput = document.getElementById("title");
const genreInput = document.getElementById("genre");
const durationInput = document.getElementById("duration");
const languageInput = document.getElementById("language");
const descriptionInput = document.getElementById("description");

const toastContainer = document.getElementById("toastContainer");

// In-memory cache of all movies (used for client-side search filtering)
let allMovies = [];

// ==========================================================
// INITIALIZATION
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  loadMovies();

  addMovieBtn.addEventListener("click", () => openModal("add"));
  closeModalBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  movieForm.addEventListener("submit", handleFormSubmit);
  searchInput.addEventListener("input", handleSearch);

  // Close modal when clicking outside the modal box
  movieModal.addEventListener("click", (event) => {
    if (event.target === movieModal) {
      closeModal();
    }
  });

  // Close modal on ESC key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && movieModal.classList.contains("active")) {
      closeModal();
    }
  });
});

// ==========================================================
// LOAD MOVIES (GET /movies)
// ==========================================================
async function loadMovies() {
  showLoading(true);
  try {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json();
    allMovies = Array.isArray(data) ? data : data.movies || [];

    renderMovies(allMovies);
  } catch (error) {
    console.error(error);
    showToast("Unable to load movies. Please check your backend server.", "error");
    renderMovies([]);
  } finally {
    showLoading(false);
  }
}

// ==========================================================
// RENDER MOVIES AS CARDS
// ==========================================================
function renderMovies(movies) {
  movieGrid.innerHTML = "";

  if (!movies || movies.length === 0) {
    emptyState.style.display = "flex";
    movieGrid.style.display = "none";
    return;
  }

  emptyState.style.display = "none";
  movieGrid.style.display = "grid";

  movies.forEach((movie) => {
    const card = document.createElement("article");
    card.className = "movie-card";

    card.innerHTML = `
      <div class="card-icon">🎬</div>
      <h3 class="card-title">${escapeHtml(movie.title)}</h3>
      <div class="card-meta">
        <span class="badge">${escapeHtml(movie.genre)}</span>
        <span class="badge">${escapeHtml(movie.language)}</span>
        <span class="badge">${escapeHtml(String(movie.duration))} min</span>
      </div>
      <p class="card-description">${escapeHtml(movie.description) || "No description available."}</p>
      <div class="card-actions">
        <button class="btn btn-edit" data-action="edit" data-id="${movie.id}">Edit</button>
        <button class="btn btn-delete" data-action="delete" data-id="${movie.id}">Delete</button>
      </div>
    `;

    movieGrid.appendChild(card);
  });

  // Attach event listeners for edit/delete buttons (event delegation not required here since list re-renders each time)
  movieGrid.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener("click", () => fillEditForm(btn.dataset.id));
  });

  movieGrid.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", () => deleteMovie(btn.dataset.id));
  });
}

// ==========================================================
// ADD MOVIE (POST /movies)
// ==========================================================
async function addMovie(movieData) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movieData),
  });

  if (!response.ok) {
    throw new Error("Failed to add movie");
  }

  return response.json();
}

// ==========================================================
// UPDATE MOVIE (PUT /movies/:id)
// ==========================================================
async function updateMovie(id, movieData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movieData),
  });

  if (!response.ok) {
    throw new Error("Failed to update movie");
  }

  return response.json();
}

// ==========================================================
// DELETE MOVIE (DELETE /movies/:id)
// ==========================================================
async function deleteMovie(id) {
  const confirmed = confirm("Are you sure you want to delete this movie?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete movie");
    }

    // Remove the movie instantly from the local cache and re-render
    allMovies = allMovies.filter((movie) => String(movie.id) !== String(id));
    renderMovies(applyCurrentSearchFilter());

    showToast("Movie Deleted Successfully", "success");
  } catch (error) {
    console.error(error);
    showToast("Something went wrong while deleting the movie.", "error");
  }
}

// ==========================================================
// MODAL: OPEN
// ==========================================================
function openModal(mode) {
  resetForm();

  if (mode === "add") {
    modalTitle.textContent = "Add Movie";
  }

  movieModal.classList.add("active");
}

// ==========================================================
// MODAL: CLOSE
// ==========================================================
function closeModal() {
  movieModal.classList.remove("active");
  resetForm();
}

// ==========================================================
// FILL EDIT FORM (prefill values for editing)
// ==========================================================
function fillEditForm(id) {
  const movie = allMovies.find((m) => String(m.id) === String(id));
  if (!movie) {
    showToast("Movie not found.", "error");
    return;
  }

  resetForm();

  modalTitle.textContent = "Edit Movie";
  movieIdInput.value = movie.id;
  titleInput.value = movie.title || "";
  genreInput.value = movie.genre || "";
  durationInput.value = movie.duration || "";
  languageInput.value = movie.language || "";
  descriptionInput.value = movie.description || "";

  movieModal.classList.add("active");
}

// ==========================================================
// RESET FORM
// ==========================================================
function resetForm() {
  movieForm.reset();
  movieIdInput.value = "";
  clearFormErrors();
}

// ==========================================================
// FORM SUBMIT HANDLER (decides Add vs Update)
// ==========================================================
async function handleFormSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const movieData = {
    title: titleInput.value.trim(),
    genre: genreInput.value.trim(),
    duration: durationInput.value.trim(),
    language: languageInput.value.trim(),
    description: descriptionInput.value.trim(),
  };

  const id = movieIdInput.value;
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  try {
    if (id) {
      // Editing an existing movie
      const updated = await updateMovie(id, movieData);
      const updatedMovie = updated && updated.id ? updated : { ...movieData, id };

      allMovies = allMovies.map((m) =>
        String(m.id) === String(id) ? updatedMovie : m
      );

      showToast("Movie Updated Successfully", "success");
    } else {
      // Adding a new movie
      const created = await addMovie(movieData);
      const newMovie = created && created.id ? created : { ...movieData, id: Date.now() };

      allMovies.push(newMovie);
      showToast("Movie Added Successfully", "success");
    }

    renderMovies(applyCurrentSearchFilter());
    closeModal();
  } catch (error) {
    console.error(error);
    showToast("Something went wrong. Please try again.", "error");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save Movie";
  }
}

// ==========================================================
// FORM VALIDATION
// ==========================================================
function validateForm() {
  clearFormErrors();
  let isValid = true;

  if (!titleInput.value.trim()) {
    setFieldError(titleInput, "titleError", "Movie title is required.");
    isValid = false;
  }

  if (!genreInput.value.trim()) {
    setFieldError(genreInput, "genreError", "Genre is required.");
    isValid = false;
  }

  if (!durationInput.value.trim()) {
    setFieldError(durationInput, "durationError", "Duration is required.");
    isValid = false;
  } else if (Number(durationInput.value) <= 0) {
    setFieldError(durationInput, "durationError", "Duration must be greater than 0.");
    isValid = false;
  }

  if (!languageInput.value.trim()) {
    setFieldError(languageInput, "languageError", "Language is required.");
    isValid = false;
  }

  // Description is optional — no validation needed

  return isValid;
}

function setFieldError(inputEl, errorId, message) {
  inputEl.classList.add("input-error");
  document.getElementById(errorId).textContent = message;
}

function clearFormErrors() {
  [titleInput, genreInput, durationInput, languageInput].forEach((input) => {
    input.classList.remove("input-error");
  });

  ["titleError", "genreError", "durationError", "languageError"].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
}

// ==========================================================
// SEARCH / CLIENT-SIDE FILTERING
// ==========================================================
function handleSearch() {
  renderMovies(applyCurrentSearchFilter());
}

function applyCurrentSearchFilter() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    return allMovies;
  }

  return allMovies.filter((movie) =>
    (movie.title || "").toLowerCase().includes(query)
  );
}

// ==========================================================
// LOADING STATE
// ==========================================================
function showLoading(isLoading) {
  loadingSpinner.style.display = isLoading ? "flex" : "none";
  movieGrid.style.display = isLoading ? "none" : "grid";
  emptyState.style.display = "none";
}

// ==========================================================
// TOAST NOTIFICATIONS
// ==========================================================
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Automatically remove the toast after its animation completes
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ==========================================================
// UTILITY: ESCAPE HTML (prevents basic HTML/script injection in card content)
// ==========================================================
function escapeHtml(value) {
  if (value === undefined || value === null) return "";
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
