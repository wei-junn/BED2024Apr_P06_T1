document.addEventListener("DOMContentLoaded", function() {
    fetch('/events')
        .then(response => response.json())
        .then(events => {
            const eventsGrid = document.getElementById('eventsGrid');
            eventsGrid.innerHTML = ''; // Clear any existing content

            events.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.classList.add('card');

                const eventStartTime = new Date(event.TimeStart).toLocaleString();
                const eventEndTime = new Date(event.TimeEnd).toLocaleString();

                eventCard.innerHTML = `
                    <div class="card-header">
                        <div class="card-title">
                            <h2><strong>${event.EventName}</strong></h2>
                        </div>
                    </div>
                    <br>
                    <div class="card-header">
                        <div class="card-title smaller-text">${event.EventDescription}</div>
                    </div>
                    <br>
                    <div class="card-header">
                        <div class="card-title smaller-text">${eventStartTime}</div>
                    </div>
                    <br>
                    <div class="card-header">
                        <div class="card-title smaller-text">${eventEndTime}</div>
                    </div>
                    <div class="card-footer"></div>
                `;

                eventsGrid.appendChild(eventCard);
            });
        })
        .catch(error => console.error('Error fetching events:', error));
});