document
  .getElementById("test-button")
  .addEventListener("click", async function () {
    try {
      const response = await axios.get("http://localhost:5501/fetch-papers");
      const papers = response.data;
      console.log(papers);
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
