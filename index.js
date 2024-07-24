document.addEventListener('DOMContentLoaded', () => {
    const photoContainer = document.getElementById('photo-container');
    const postPhotoForm = document.getElementById('post-photo-form');
  
    // Fetch photos from the local JSON server
    fetch('http://localhost:3000/photos')
      .then(response => response.json())
      .then(photos => {
        photos.forEach(photo => {
          displayPhoto(photo);
        });
      });
  
    // Event listener for posting a new photo
    postPhotoForm.addEventListener('submit', event => {
      event.preventDefault();
      const url = document.getElementById('photo-url').value;
      const description = document.getElementById('photo-description').value;
  
      const newPhoto = {
        url,
        description,
        likes: 0
      };
  
      fetch('http://localhost:3000/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPhoto)
      })
      .then(response => response.json())
      .then(photo => {
        displayPhoto(photo);
        postPhotoForm.reset();
      });
    });
  
    // Function to display a photo
    function displayPhoto(photo) {
      const photoDiv = document.createElement('div');
      photoDiv.classList.add('photo');
      photoDiv.innerHTML = `
        <img src="${photo.url}" alt="${photo.description}">
        <p>${photo.description}</p>
        <button class="like-button">Like (<span>${photo.likes}</span>)</button>
      `;
      photoContainer.appendChild(photoDiv);
  
      // Event listener for liking a photo
      const likeButton = photoDiv.querySelector('.like-button');
      likeButton.addEventListener('click', () => {
        photo.likes += 1;
        likeButton.querySelector('span').textContent = photo.likes;
  
        fetch(`http://localhost:3000/photos/${photo.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ likes: photo.likes })
        });
      });
    }
  });
  