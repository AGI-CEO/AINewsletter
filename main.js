document
  .getElementById("subscribe-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value;

    axios
      .post("/subscribe", {
        email: email,
      })
      .then(function (response) {
        alert("Subscription successful");
      })
      .catch(function (error) {
        alert("Error subscribing");
      });
  });
