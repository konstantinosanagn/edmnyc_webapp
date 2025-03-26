document.addEventListener("DOMContentLoaded", function () {
    fetch("/events")
      .then(response => response.json())
      .then(events => {
        if (!events || events.length === 0) {
          console.error("No events found.");
          return;
        }
        
        // Filter events – using IDs for Cityfox, Dimitri Vegas, and Peggy Gou
        const popularEventIDs = ["2", "1", "10"];
        const popularEvents = events.filter(event => popularEventIDs.includes(event.id));
        
        // Get the container (assumed to be a Bootstrap row)
        const eventsContainer = document.getElementById("popular-events-list");
        
        popularEvents.forEach(event => {
          if (!event.id || !event.title || !event.media || !event.startDate || !event.venue) {
            console.error("Event data missing required fields:", event);
            return;
          }
          
          // Format the date as: Sat, July 13
          const formattedDate = new Date(event.startDate).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'long', 
            day: 'numeric' 
          });
          
          // Create a Bootstrap column (3 columns per row)
          const colDiv = document.createElement("div");
          colDiv.classList.add("col-md-4", "d-flex", "align-items-stretch");
          
          // Create a clickable card with two sections: image and info.
          // Each info attribute is wrapped in its own div.
          colDiv.innerHTML = `
            <a href="/view/${event.id}" class="card event-card" aria-label="View details for ${event.title}">
              <!-- Image Section -->
              <div class="row no-gutters">
                <div class="col-12 image-section">
                  <img src="${event.media}" class="card-img-top" alt="${event.title || 'Event image'}">
                </div>
              </div>
              <!-- Info Section -->
              <div class="row no-gutters">
                <div class="col-12 info-section">
                  <div class="info-title">
                    <h5 class="card-title">${event.title}</h5>
                  </div>
                  <div class="info-date">
                    <p class="card-text"><strong></strong> ${formattedDate}</p>
                  </div>
                  <div class="info-location">
                    <p class="card-text"><strong></strong> ${event.venue}</p>
                  </div>
                </div>
              </div>
            </a>
          `;
          
          eventsContainer.appendChild(colDiv);
        });
      })
      .catch(error => console.error("Error fetching events:", error));

   // --- Typewriter Effect for Experience Text ---
   const words = ["immersive", "techno", "breathtaking", "house", "dazzling", "unforgettable"];
   let currentWordIndex = 0;
   let currentLetterIndex = 0;
   let isDeleting = false;
   const typeSpeed = 150; // time between each character
   const experienceElement = document.querySelector('.experience-text-eff');
 
   function typeWriter() {
     let currentWord = words[currentWordIndex];
     
     if (isDeleting) {
       currentLetterIndex--;
       experienceElement.textContent = currentWord.substring(0, currentLetterIndex);
       if (currentLetterIndex <= 0) {
         isDeleting = false;
         currentWordIndex = (currentWordIndex + 1) % words.length;
         setTimeout(typeWriter, 500); // pause before typing next word
         return;
       }
     } else {
       currentLetterIndex++;
       experienceElement.textContent = currentWord.substring(0, currentLetterIndex);
       if (currentLetterIndex === currentWord.length) {
         isDeleting = true;
         setTimeout(typeWriter, 2000); // pause at full word
         return;
       }
     }
     setTimeout(typeWriter, typeSpeed);
   }
 
   typeWriter();
});