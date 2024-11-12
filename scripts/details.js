document.addEventListener('DOMContentLoaded', function () {
  const database = firebase.database();
  const pageName = window.location.pathname.split("/").pop().split(".")[0];

  if (pageName === 'index') {
    for (let i = 1; i <= 5; i++) {
      const item = database.ref("Phones/" + i);

      const card = document.getElementById('card-' + i);
      const cradImg = card.querySelector('.card-img-top');
      const cardTitle = card.querySelector('.card-title');
      const cardDescription = card.querySelector('.card-text');

      item.once('value', (snapshot) => {
        const itemInfo = snapshot.val();

        if (itemInfo) {
          cradImg.src = itemInfo.image;
          cardTitle.textContent = itemInfo.brand;
          cardDescription.textContent = itemInfo.description;
        }
      });
    }

    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');

  const itemRef = database.ref("Phones/" + productId);
  const reviewsRef = database.ref("Reviews/" + productId);

  const reviewsContainer = document.getElementById("reviewsContainer");

  itemRef.on('value', (snapshot) => {
    const itemDetails = snapshot.val();

    if (itemDetails) {
      document.getElementById("item-name").innerText = itemDetails.brand;
      document.getElementById("item-description").innerText = itemDetails.description;
      document.getElementById("item-stock").innerText = `Items in stock: ${itemDetails.stock}`;
      document.getElementById("item-price").innerText = `Price: ${itemDetails.price}$`;
      document.getElementById("item-image").src = itemDetails.image;

      if (reviewsRef) {
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
      else {
        maxKey = 0;
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

  const clearBtn = document.getElementById('clearButton');

  clearBtn.addEventListener('click', function () {
    if (reviewsRef) {
      reviewsRef.set({});
    }
    
    clearBtn.blur();
  });
});