async function fetchLocations() {

    const response = await fetch("/locations"); // Replace with your API endpoint
    const data = await response.json();

    
    const locationList = document.getElementById("location-list");

    // <div class="cc">
    //                 <h3>Clementi CC</h3>
    //                 <p>220, Clementi Ave 4,129880</p>
    //                 <p>Opening Hours: 10am-7pm</p>
    //                 <p>Tel: 67762937</p>
    //                 <p>1.2 km away</p>
    //             </div>
  
    data.forEach((location) => {
      const locationItem = document.createElement("div");
      locationItem.classList.add("cc"); // Add a CSS class for styling
  
      // Create elements for title, author, etc. and populate with book data
      const titleElement = document.createElement("h3");
      titleElement.textContent = location.name;
  
      const addressElement = document.createElement("p");
      addressElement.textContent = location.street_address;

      const postalElement = document.createElement("p");
      postalElement.textContent = location.postal_code;

      const telElement = document.createElement("p");
      telElement.textContent = `Tel: ${location.tel_num}`;
  
      // ... add more elements for other book data (optional)
  
      locationItem.appendChild(titleElement);
      locationItem.appendChild(addressElement);
      locationItem.appendChild(postalElement);
      locationItem.appendChild(telElement);

      // ... append other elements
  
      locationList.appendChild(locationItem);
    });
  }
  
  fetchLocations(); // Call the function to fetch and display book data