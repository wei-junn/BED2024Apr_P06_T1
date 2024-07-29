async function fetchLocations() {

    const response = await fetch("/locations"); // Replace with your API endpoint
    const data = await response.json();

    
    const locationList = document.getElementById("location-list");

  
    data.forEach((location) => {
      const locationItem = document.createElement("div");
      locationItem.classList.add("cc"); // Add a CSS class for styling

      // Create a link element to update the location
      const updateLink = document.createElement("a");
      updateLink.href = `/update_location.html?id=${location.id}`;
      updateLink.textContent = location.name;
      updateLink.style.display = 'block'; // Ensure it appears on a new line
  
      // Create elements for title, author, etc. and populate with book data
      const titleElement = document.createElement("h3");
      //titleElement.textContent = location.name;
      titleElement.appendChild(updateLink);
  
      const addressElement = document.createElement("p");
      addressElement.textContent = location.street_address;

      const postalElement = document.createElement("p");
      postalElement.textContent = location.postal_code;

      const telElement = document.createElement("p");
      telElement.textContent = `Tel: ${location.tel_num}`;
  
    
      
  
      locationItem.appendChild(titleElement);
      locationItem.appendChild(addressElement);
      locationItem.appendChild(postalElement);
      locationItem.appendChild(telElement);
  

      // ... append other elements
  
      locationList.appendChild(locationItem);
    });
  }
  
  fetchLocations(); // Call the function to fetch and display book data