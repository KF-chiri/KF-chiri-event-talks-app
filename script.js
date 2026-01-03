document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const talkCards = document.querySelectorAll('.talk-card');
      
      talkCards.forEach(card => {
        const categories = card.dataset.categories.toLowerCase();
        if (categories.includes(searchTerm)) {
          card.parentElement.style.display = 'flex';
        } else {
          card.parentElement.style.display = 'none';
        }
      });
    });
  }
});
