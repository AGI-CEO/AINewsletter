document
  .getElementById("test-button")
  .addEventListener("click", async function () {
    try {
      const response = await axios.get("http://localhost:5501/fetch-papers");
      const papers = response.data;

      // Create the parent element where you want to append the papers
      const papersContainer = document.createElement("div");
      papersContainer.id = "papers-container";
      papersContainer.className = "dark:bg-gray-900 text-white mx-auto";
      papersContainer.style.width = "50%";
      papersContainer.style.minWidth = "800px";
      papersContainer.style.margin = "0 auto";

      // Create a new element for each paper
      papers.forEach((paper) => {
        const paperElement = document.createElement("div");
        paperElement.className = "dark:bg-gray-800 text-white"; // Add classes here
        paperElement.style.margin = "10ppx auto";

        const titleElement = document.createElement("h2");
        titleElement.textContent = paper.title;
        titleElement.className = "dark:text-white"; // Add classes here
        paperElement.appendChild(titleElement);

        const authorsElement = document.createElement("p");
        authorsElement.textContent = paper.authors.join(", ");
        authorsElement.className = "dark:text-gray-300"; // Add classes here
        paperElement.appendChild(authorsElement);

        const summaryElement = document.createElement("p");
        summaryElement.textContent = paper.summary;
        summaryElement.className = "dark:text-gray-300"; // Add classes here
        paperElement.appendChild(summaryElement);

        const linkElement = document.createElement("a");
        linkElement.href = paper.link;
        linkElement.textContent = "Read More";
        linkElement.className = "dark:text-blue-500"; // Add classes here
        paperElement.appendChild(linkElement);

        // Append the paper element to the parent container
        papersContainer.appendChild(paperElement);
      });

      // Append the container to the body or another existing element
      document.body.appendChild(papersContainer);
    } catch (error) {
      console.error("Error fetching papers:", error);
    }
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
