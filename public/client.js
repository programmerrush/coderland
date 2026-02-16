// Client-side shared logic

// Helper Status Fetcher
async function getStatus() {
  try {
    const response = await fetch("/api/system/status");
    if (!response.ok) {
      throw new Error("Failed to fetch status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching status:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // --- JOIN PAGE LOGIC (index.html) ---
  const joinForm = document.getElementById("join-form");
  if (joinForm) {
    joinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const uid = document.getElementById("uid").value;
      // Removed classCode input, handled by backend default
      const consent = document.getElementById("consent").checked;
      const msgEl = document.getElementById("message");

      if (!consent) {
        msgEl.textContent = "You must agree to continue.";
        return;
      }

      try {
        const res = await fetch("/api/auth/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, consent }), // Removed classCode from body
        });
        const data = await res.json();

        if (data.redirect) {
          window.location.href = data.redirect;
        } else {
          msgEl.textContent = data.message || "Join failed.";
          msgEl.className = "error";
        }
      } catch (err) {
        msgEl.textContent = "Error connecting to server.";
      }
    });
  }

  // --- DASHBOARD PAGE LOGIC (dashboard.html) ---
  const uidDisplay = document.getElementById("uid-display");
  if (uidDisplay) {
    const status = await getStatus();
    if (status && status.uid) {
      uidDisplay.textContent = status.uid;
    }

    // Fetch Trainer Messages
    const msgContainer = document.getElementById("trainer-messages");
    if (msgContainer) {
      try {
        const res = await fetch("/api/action/messages");
        const data = await res.json();

        msgContainer.innerHTML = ""; // Clear loading

        if (data.success && data.messages && data.messages.length > 0) {
          data.messages.forEach((msg) => {
            const div = document.createElement("div");
            div.className = "message-item";

            const text = document.createElement("div");
            text.textContent = msg.text;

            const time = document.createElement("span");
            time.className = "message-time";
            time.textContent = new Date(msg.timestamp).toLocaleTimeString();

            div.appendChild(text);
            div.appendChild(time);
            msgContainer.appendChild(div);
          });
        } else {
          msgContainer.innerHTML =
            '<div style="color: #666;">No messages from trainer.</div>';
        }
      } catch (err) {
        msgContainer.innerHTML =
          '<div style="color: red;">Failed to load messages.</div>';
      }
    }
  }

  const raiseHandBtn = document.getElementById("raise-hand-btn");
  if (raiseHandBtn) {
    raiseHandBtn.addEventListener("click", async () => {
      const msgEl = document.getElementById("hand-message");
      msgEl.textContent = "Raising hand...";
      try {
        const res = await fetch("/api/action/raise-hand", { method: "POST" });
        const data = await res.json();
        msgEl.textContent = data.message;
        setTimeout(() => (msgEl.textContent = ""), 3000);
      } catch (err) {
        msgEl.textContent = "Failed to raise hand.";
        msgEl.className = "error";
      }
    });
  }

  // Removed messageForm logic

  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to reset? This will sign you out."))
        return;

      try {
        const res = await fetch("/api/action/reset", { method: "POST" });
        const data = await res.json();
        if (data.redirect) {
          window.location.href = data.redirect;
        }
      } catch (err) {
        alert("Reset failed.");
      }
    });
  }
});
