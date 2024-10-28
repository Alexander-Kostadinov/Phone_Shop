document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');
  
  const database = firebase.database();
  const itemRef = database.ref("Phones/" + productId);
  const reviewsRef = database.ref("Reviews/" + productId);

  itemRef.on('value', (snapshot) => {
    const itemDetails = snapshot.val();

    if (itemDetails) {
      document.getElementById("item-name").innerText = itemDetails.model;
      document.getElementById("item-description").innerText = itemDetails.description;
      document.getElementById("item-stock").innerText = `Items in stock: ${itemDetails.stock}`;
      document.getElementById("item-price").innerText = `Price: ${itemDetails.price}$`;
      document.getElementById("item-image").src = itemDetails.image;
      const reviewsContainer = document.getElementById("reviewsContainer");

      reviewsRef.on("value", function (snapshot) {
        reviewsContainer.innerHTML = "";
        var reviews = snapshot.val();

        for (let value in reviews) {
          if (reviews.hasOwnProperty(value)) {
            var child = document.createElement('p');
            child.textContent = "Submitted: " + reviews[value];
            reviewsContainer.insertBefore(child, reviewsContainer.firstChild);
          }
        }
      });
    }
    else {
      console.log("Item not found!");
    }
  }, (error) => {
    console.error("Error fetching item:", error);
  });

  const submitBtn = document.getElementById('submitButton');

  submitBtn.addEventListener('click', function (event) {
    event.preventDefault();
    var reviewTextArea = document.getElementById('review');
    var reviewContent = reviewTextArea.value;

    if (reviewContent === '') {
      alert("Please enter your review before click the Submit button!");
      event.target.blur();
      return;
    }

    let maxKey = 0;

    reviewsRef.once("value", function (snapshot) {
      if (snapshot.exists() && snapshot.hasChildren()) {
        snapshot.forEach(function (childSnapshot) {
          var key = parseInt(childSnapshot.key);

          if (!isNaN(key) && key > maxKey) {
            maxKey = key;
          }
        });
      }

      var newKey = maxKey + 1;
      var value = reviewContent;
      var newReview = {};
      newReview[newKey] = value;

      reviewsRef.update(newReview)
        .then(function () {
          console.log("Key-value pair added successfully!");
        })
        .catch(function (error) {
          console.error("Error adding key-value pair:", error);
        });
    });

    reviewTextArea.value = '';
    event.target.blur();
  });
});