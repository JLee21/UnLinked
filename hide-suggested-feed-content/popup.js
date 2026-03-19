const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

function updateStatus(isEnabled) {
  status.textContent = isEnabled ? "Active" : "Paused";
}

chrome.storage.local.get({ enabled: true }, (result) => {
  toggle.checked = result.enabled;
  updateStatus(result.enabled);
});

toggle.addEventListener("change", () => {
  const isEnabled = toggle.checked;
  chrome.storage.local.set({ enabled: isEnabled });
  updateStatus(isEnabled);
});
