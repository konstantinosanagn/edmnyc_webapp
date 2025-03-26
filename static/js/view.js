document.addEventListener("DOMContentLoaded", function () {
    const currentEventID = CURRENT_EVENT_ID; // Global variable from view.html
  
    fetch("/events")
      .then(response => response.json())
      .then(events => {
        if (!events || events.length === 0) {
          console.error("No events found.");
          return;
        }
        
        // Hardcoded list of IDs for the three similar events.
        const targetIDs = ["2", "10", "6"];
        
        // Filter for events with these IDs and exclude the current event (if it's one of them)
        const similarEvents = events.filter(e => targetIDs.includes(e.id) && e.id !== currentEventID);
        
        const container = document.getElementById("similar-events-list");
        
        similarEvents.forEach(event => {
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
          colDiv.classList.add("col-md-4", "d-flex", "align-items-stretch", "mb-3");
    
          // Create a clickable card with two sections: image and info.
          colDiv.innerHTML = `
            <a href="/view/${event.id}" class="card event-card" aria-label="View details for ${event.title}">
              <div class="row no-gutters">
                <div class="col-12 image-section">
                  <img 
                    src="${event.media}" 
                    class="card-img-top" 
                    alt="${event.title || 'Event image'}" 
                    loading="lazy"
                  >
                </div>
              </div>
              <div class="row no-gutters">
                <div class="col-12 info-section">
                  <div class="info-title">
                    <h5 class="card-title">${event.title}</h5>
                  </div>
                  <div class="info-date">
                    <p class="card-text">${formattedDate}</p>
                  </div>
                  <div class="info-location">
                    <p class="card-text">${event.venue}</p>
                  </div>
                </div>
              </div>
            </a>
          `;
          
          container.appendChild(colDiv);
        });
      })
      .catch(error => console.error("Error fetching events:", error));
    
    // Fetch artist images from artists.json
    fetch(ARTISTS_JSON_URL)
      .then(response => response.json())
      .then(artistsData => {
        document.querySelectorAll('.artist-item').forEach(item => {
          const artistName = item.getAttribute('data-artist-name').toLowerCase();
          const match = artistsData.find(a => a.name.toLowerCase() === artistName);
          if (match && match.link) {
            const circle = item.querySelector('.artist-circle');
            circle.style.backgroundImage = `url("${match.link}")`;
          } else {
            // Fallback for missing artist images
            const circle = item.querySelector('.artist-circle');
            circle.style.backgroundImage = 'url("/static/images/placeholder.jpg")';
          }
        });
      })
      .catch(error => console.error("Error fetching artists.json:", error));
});