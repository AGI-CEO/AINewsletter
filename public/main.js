let papers = [];
let paperElements = {};

function createPaperElements() {
  console.log("Starting to create paper elements");

  // Create the parent element where you want to append the papers
  const papersContainer = document.createElement("div");
  papersContainer.id = "papers-container";
  papersContainer.className = "dark:bg-gray-800 text-white mx-auto";
  papersContainer.style.width = "75vw";
  papersContainer.style.minWidth = "50vw";
  papersContainer.style.margin = "0 auto";

  // Create a new element for each paper
  papers.forEach((paper) => {
    const paperElement = document.createElement("div");

    // Extract the number from the paper link
    const id = "paper-" + paper.link.split("/").pop();
    console.log("Created paper element with id:", id);

    paperElement.id = id; // Assign a unique id to each paper element
    paperElement.className =
      "dark:bg-gray-700 text-white rounded-lg shadow-lg p-6 my-4 transform transition duration-500 ease-in-out hover:scale-105";

    const titleElement = document.createElement("h2");
    titleElement.textContent = paper.title;
    titleElement.className = "dark:text-white text-2xl mb-2";
    titleElement.style.paddingBottom = "20px"; // Add more padding between the title and authors
    titleElement.style.lineHeight = "1.5"; // Add more vertical spacing in the title element
    paperElement.appendChild(titleElement);
    titleElement.style.fontSize = "3vw";

    const authorsElement = document.createElement("p");
    authorsElement.textContent = paper.authors.join(", ");
    authorsElement.className = "dark:text-gray-300 mb-4";
    paperElement.appendChild(authorsElement);

    const summaryElement = document.createElement("p");
    summaryElement.textContent = paper.summary;
    summaryElement.className = "dark:text-gray-300 mb-4";
    paperElement.appendChild(summaryElement);

    const linkElement = document.createElement("a");
    linkElement.href = paper.link;
    linkElement.textContent = "Read More";
    linkElement.className = "dark:text-blue-500 underline";
    paperElement.appendChild(linkElement);
    // Append the paper element to the parent container
    papersContainer.appendChild(paperElement);

    // Store the paper element in the global variable
    paperElements[id] = paperElement;
  });

  // Append the container to the body or another existing element
  document.body.insertBefore(papersContainer, document.querySelector("footer"));

  console.log("Finished creating paper elements");
}

document
  .getElementById("test-button")
  .addEventListener("click", async function () {
    event.preventDefault();
    try {
      const response = await axios.get("http://localhost:5501/fetch-papers");
      papers = response.data;

      // Create the paper elements
      createPaperElements();
    } catch (error) {
      console.error("Error fetching papers:", error);
    }
  });

document
  .getElementById("summarize-button")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Create a new EventSource connected to the /summarize-papers route
    const source = new EventSource("http://localhost:5501/summarize-papers");

    source.onmessage = function (event) {
      const summary = JSON.parse(event.data); // Parse the summary from the event data

      // Extract the number from the summary link
      const id = "paper-" + summary.link.split("/").pop();

      // Select the existing paper element
      const paperElement = paperElements[id];

      // Check if the paper element exists
      if (paperElement) {
        // Create a new header for the AI summary
        const AIsummaryHeader = document.createElement("h3");
        AIsummaryHeader.textContent = "🤖 AI Summary";
        AIsummaryHeader.className =
          "dark:text-white text-xl mb-2 ai-summary-header";

        // Append the AI summary header to the paper element
        paperElement.appendChild(AIsummaryHeader);

        // Create a new element for the AI summary
        const AIsummaryElement = document.createElement("p");
        AIsummaryElement.textContent = summary.AIsummary;
        AIsummaryElement.className = "summary-text dark:text-gray-300";

        // Append the AI summary to the paper element
        paperElement.appendChild(AIsummaryElement);
      } else {
        console.error(`Paper element with id "${id}" not found`);
      }
    };

    source.onerror = function (error) {
      console.error("EventSource error:", error);
      source.close();
    };
  });

document
  .getElementById("subscribe-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value;

    axios
      .post("http://localhost:5501/subscribe", {
        email: email,
        utm_source: "AIResearcher",
        utm_medium: "organic",
        reactivate_existing: false,
        send_welcome_email: true,
      })
      .then(function (response) {
        alert("Subscription successful");
      })
      .catch(function (error) {
        alert("Error subscribing");
      });
  });

// Function to create multiple sword elements
function createSwords() {
  const h1Element = document.querySelector("h1"); // Select the h1 element
  h1Element.style.position = "relative"; // Make sure the h1 element has a relative position

  for (let i = 0; i < 10; i++) {
    const sword = document.createElement("div");
    sword.textContent = "🗡️";
    sword.style.position = "absolute";
    sword.style.whiteSpace = "nowrap";
    sword.style.fontSize = "30px"; // Adjust the font size as needed
    h1Element.appendChild(sword); // Append the swords to the h1 element
  }
}

// Function to animate the swords
function animateSwords() {
  const swords = document.querySelectorAll("h1 div"); // Select the sword elements correctly
  let angle = 0;

  setInterval(() => {
    swords.forEach((sword, index) => {
      const radius = 52;
      const x = radius * Math.cos(angle + (index * Math.PI) / swords.length);
      const y = radius * Math.sin(angle + (index * Math.PI) / swords.length);
      sword.style.left = 50 + x + "%";
      sword.style.top = y + "%";
    });

    angle += 0.01;
  }, 20);
}

// Function to start the sword animation
function startSwordAnimation() {
  createSwords();
  animateSwords();
}

window.onload = function () {
  startSwordAnimation();
};
