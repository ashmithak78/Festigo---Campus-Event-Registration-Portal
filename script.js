let users = JSON.parse(localStorage.getItem("users")) || [];
let registeredEvents = JSON.parse(localStorage.getItem("registeredEvents")) || {};
let currentEvent = "";
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
const nameRegex = /^[A-Za-z ]{3,}$/;                
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   
const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/; 
const phoneRegex = /^[0-9]{10}$/;                
function openLogin() {
  document.getElementById("loginOverlay").style.display = "flex";
}
function closeLogin() {
  document.getElementById("loginOverlay").style.display = "none";
}
function loginUser() {
  let email = document.getElementById("loginEmail").value.trim();
  let password = document.getElementById("loginPassword").value;
  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }
  if (!emailRegex.test(email)) {
    alert("Invalid email");
    return;
  }
  let user = users.find(u => u.email === email);
  if (!user) {
    alert("No account found with this email. Please sign up!");
    openSignUp();
    return;
  }
  if (user.password !== password) {
    alert("Incorrect password. Try again!");
    return;
  }
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
  alert("Login successful!");
  closeLogin();
  document.getElementById("landingPage").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
  document.getElementById("userDisplay").innerText = currentUser.name;
  updateAuthUI(); 
}
function openSignUp() {
  document.getElementById("signupOverlay").style.display = "flex";
}
function closeSignUp() {
  document.getElementById("signupOverlay").style.display = "none";
}
function submitSignUp() {
  let name = document.getElementById("signupName").value.trim();
  let email = document.getElementById("signupEmail").value.trim();
  let password = document.getElementById("signupPassword").value;
  let phone = document.getElementById("signupPhone").value;
  if (!name || !email || !password || !phone) {
    alert("Fill all fields");
    return;
  }
  if (!nameRegex.test(name)) {
    alert("Name must be at least 3 letters and only alphabets");
    return;
  }
  if (!emailRegex.test(email)) {
    alert("Invalid email format");
    return;
  }
  if (!passwordRegex.test(password)) {
    alert("Password must have at least 6 characters, 1 uppercase letter and 1 number");
    return;
  }
  if (!phoneRegex.test(phone)) {
    alert("Phone must be exactly 10 digits");
    return;
  }
  if (users.find(u => u.email === email)) {
    alert("User already exists!");
    return;
  }
  let newUser = { name, email, password, phone };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  alert("Signup successful! You are now logged in.");
  closeSignUp();
  document.getElementById("landingPage").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
  document.getElementById("userDisplay").innerText = currentUser.name;
  updateAuthUI();
}
function logoutUser() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  document.getElementById("landingPage").style.display = "flex";
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("userDisplay").innerText = "";
  updateAuthUI();
  alert("Logged out!");
}
function openForm(title, desc) {
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("eventTitle").innerText = title;
  document.getElementById("eventDesc").innerText = desc;
  currentEvent = title;
}
function closeForm() {
  document.getElementById("overlay").style.display = "none";
}
function submitRegistration() {
  if (!currentUser) {
    alert("Login first!");
    return;
  }
  if (!registeredEvents[currentUser.email]) {
    registeredEvents[currentUser.email] = [];
  }
  if (registeredEvents[currentUser.email].includes(currentEvent)) {
    alert("Already registered!");
    return;
  }
  registeredEvents[currentUser.email].push(currentEvent);
  localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));
  alert("Registered!");
  closeForm();
}
function showTab(tab, el) {
  let events = document.getElementById("events");
  let registered = document.getElementById("registered");
  if (tab === "events") {
    events.style.display = "grid";
    registered.style.display = "none";
  } else {
    events.style.display = "none";
    registered.style.display = "grid";
    loadRegisteredEvents(); 
  }
  let tabs = document.getElementsByClassName("tab");
  for (let t of tabs) t.classList.remove("active");
  el.classList.add("active");
}
function updateAuthUI() {
  let loginBtn = document.querySelector(".login:nth-child(1)");
  let signupBtn = document.querySelector(".login:nth-child(2)");
  let logoutBtn = document.querySelector(".login:nth-child(3)");
  if (currentUser) {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
}
function toggleFilters() {
  let box = document.getElementById("filterBox");
  box.style.display = box.style.display === "block" ? "none" : "block";
}
function loadRegisteredEvents() {
  let container = document.getElementById("registered");
  let emptyMsg = document.getElementById("emptyMessage");
  container.innerHTML = "";
  if (!currentUser || !registeredEvents[currentUser.email] || registeredEvents[currentUser.email].length === 0) {
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";
  registeredEvents[currentUser.email].forEach(event => {
    let div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h3>${event}</h3><p>Registered successfully</p>`;
    container.appendChild(div);
  });
}
function convertToDate(text) {
  let parts = text.split(" ");
  let month = parts[1];
  let day = parseInt(parts[2]);
  let monthMap = {
    January: 0, February: 1, March: 2, April: 3,
    May: 4, June: 5, July: 6, August: 7,
    September: 8, October: 9, November: 10, December: 11
  };
  return new Date(2026, monthMap[month], day);
}
function applyFilters() {
  let search = document.getElementById("search").value.toLowerCase();
  let category = document.getElementById("categoryFilter").value;
  let teamSize = document.getElementById("teamSizeFilter").value;
  let time = document.getElementById("timeFilter").value;
  let startDate = document.getElementById("startDate").value;
  let endDate = document.getElementById("endDate").value;
  let cards = document.querySelectorAll("#events .card");
  cards.forEach(card => {
    let show = true;
    let title = card.querySelector("h3").innerText.toLowerCase();
    let desc = card.querySelector("p").innerText.toLowerCase();
    let cardCategory = card.dataset.category;
    let cardSize = parseInt(card.dataset.size);   
    let cardTime = parseInt(card.dataset.time);
    if (search && !title.includes(search) && !desc.includes(search)) {
      show = false;
    }
    if (category && cardCategory !== category) {
      show = false;
    }
    if (teamSize === "2" && cardSize !== 2) show = false;
    if (teamSize === "3" && cardSize !== 3) show = false;
    if (teamSize === "4" && cardSize < 4) show = false;
    if (time === "morning" && !(cardTime < 12)) show = false;
    if (time === "afternoon" && !(cardTime >= 12 && cardTime < 17)) show = false;
    if (time === "evening" && !(cardTime >= 17)) show = false;
    let dateText = card.querySelectorAll("p")[1].innerText;
    let eventDate = convertToDate(dateText);
    let start = startDate ? new Date(startDate) : null;
    let end = endDate ? new Date(endDate) : null;
    if (start) start.setHours(0, 0, 0, 0);         
    if (end) end.setHours(23, 59, 59, 999);        
    if (start && eventDate < start) show = false;
    if (end && eventDate > end) show = false;
    card.style.display = show ? "block" : "none";
  });
  document.getElementById("filterBox").style.display = "none";
}
function clearFilters() {
  document.getElementById("search").value = "";
  document.getElementById("categoryFilter").value = "";
  document.getElementById("teamSizeFilter").value = "";
  document.getElementById("timeFilter").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  let cards = document.querySelectorAll("#events .card");
  cards.forEach(card => card.style.display = "block");
  document.getElementById("filterBox").style.display = "none";
}
window.onload = function () {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  const landing = document.getElementById("landingPage");
  const main = document.getElementById("mainContent");
  if (user) {
    currentUser = user;
    landing.style.display = "none";
    main.style.display = "block";
    document.getElementById("userDisplay").innerText = user.name;
  } else {
    landing.style.display = "flex";
    main.style.display = "none";
    document.getElementById("userDisplay").innerText = "";
  }
  updateAuthUI();
};