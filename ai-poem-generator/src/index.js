// Function to display the poem with Typewriter effect
function displayPoem(text) {
  const poemElement = document.querySelector("#poem-output");
  poemElement.classList.remove("hidden");

  // Use Typewriter effect
  new Typewriter(poemElement, {
    strings: text,
    autoStart: true,
    delay: 30,
    cursor: "",
  });
}

// Function to generate poem using fetch()
async function generatePoem(event) {
  event.preventDefault();

  const instructionsInput = document.querySelector("#prompt-input");
  const apiKey = "6652ce39094fdo68f706cff3baab7t3f"; 
  const context =
    "You are a romantic Poem expert. Generate a 4-line poem in basic HTML, separating each line with a <br />. Follow the user's theme.";

  const prompt = `Generate a poem about ${instructionsInput.value}`;
  const apiURL = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(context)}&key=${apiKey}`;

  const poemElement = document.querySelector("#poem-output");
  const loadingMessage = document.querySelector("#loading-message");

  // Show loading state
  loadingMessage.style.display = "block";
  poemElement.classList.add("hidden");
  poemElement.innerHTML = ""; 

  try {
    // Make API call using fetch()
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // Debugging

    // Check if response has valid data
    if (data?.text || data?.answer) {
      displayPoem(data.text || data.answer);
    } else {
      throw new Error("No poem data found in response.");
    }
  } catch (error) {
    console.error("API Error:", error);
    poemElement.innerHTML = `Error: ${error.message || "Failed to fetch poem."}`;
    poemElement.classList.remove("hidden");
  } finally {
    loadingMessage.style.display = "none";
  }
}

// Attach form submit event
document.querySelector("#poem-generator-form").addEventListener("submit", generatePoem);