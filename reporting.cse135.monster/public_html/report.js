window.addEventListener('DOMContentLoaded', (event) => {
    fetch('http://localhost:3000/posts')
      .then(response => response.json())
      .then(data => {
        const zgRef = document.querySelector('zing-grid');
        zgRef.setData(data);
      })
      .catch(error => console.error('Error:', error));
});
