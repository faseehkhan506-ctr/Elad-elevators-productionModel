function toggleForm(type) {
    document.getElementById('existingFields').style.display = (type === 'existing') ? 'block' : 'none';
    document.getElementById('newFields').style.display = (type === 'new') ? 'block' : 'none';
  }
  
  function toggleFormService(type) {
    document.getElementById('existingFieldsService').style.display = (type === 'existingService') ? 'block' : 'none';
    document.getElementById('newFieldsService').style.display = (type === 'newService') ? 'block' : 'none';
  }
  
  function getLocation(formType) {
    const status = document.getElementById(`locationStatus${formType === 'service' ? 'Service' : ''}`);
    const form = document.getElementById(`${formType}Form`);
  
    const success = (position) => {
      status.innerHTML = '<p>Location Updated <i class="fa-solid fa-location-dot fa-fade fa-lg" style="color: #FFD43B;"></i></p>';
      form.querySelector(`#${formType}Latitude`).value = position.coords.latitude;
      form.querySelector(`#${formType}Longitude`).value = position.coords.longitude;
    };
  
    const error = () => {
      status.textContent = 'Unable to retrieve your location';
    };
  
    navigator.geolocation.getCurrentPosition(success, error);
  }
  
  function sendToWhatsapp(formType) {
    const form = document.getElementById(`${formType}Form`);
  
    const name = form.querySelector(`#name${formType === 'service' ? 'Service' : ''}`).value.trim();
    const address = form.querySelector(`#address${formType === 'service' ? 'Service' : ''}`).value.trim();
    const phoneNumber = form.querySelector(`#phonenumber${formType === 'service' ? 'Service' : ''}`).value.trim();
    const email = form.querySelector(`#email${formType === 'service' ? 'Service' : ''}`).value.trim();
    const message = form.querySelector(`#message${formType === 'service' ? 'Service' : ''}`).value.trim();
    const elevatorType = form.querySelector(`input[name="elevatorType${formType === 'service' ? 'Service' : ''}"]:checked`).value;
    const latitude = form.querySelector(`#${formType}Latitude`).value || 'N/A';
    const longitude = form.querySelector(`#${formType}Longitude`).value || 'N/A';
  
    let liftType, floors, made, dimensions, passengerCapacity, passengers2, pitSize, headRoom, doorType, width, depth;
  
    if (elevatorType === 'existing' || elevatorType === 'existingService') {
      liftType = 'Existing Lift'; // Static text for Existing Lift
      floors = form.querySelector(`#existingFloors${formType === 'service' ? 'Service' : ''}`).value.trim();
      made = form.querySelector(`#existingMade${formType === 'service' ? 'Service' : ''}`).value.trim();
      passengerCapacity = form.querySelector(`#existingPassengerCapacity${formType === 'service' ? 'Service' : ''}`).value.trim();
      passengers2 = form.querySelector(`#existingPassengers2${formType === 'service' ? 'Service' : ''}`).value.trim();
      doorType = form.querySelector(`#existingDoorType${formType === 'service' ? 'Service' : ''}`).value.trim();
    } else if (elevatorType === 'new' || elevatorType === 'newService') {
      liftType = form.querySelector(`#newLiftType${formType === 'service' ? 'Service' : ''}`).value.trim();
      floors = form.querySelector(`#newFloors${formType === 'service' ? 'Service' : ''}`).value.trim();
      width = form.querySelector(`#newWidth${formType === 'service' ? 'Service' : ''}`).value.trim();
      depth = form.querySelector(`#newDepth${formType === 'service' ? 'Service' : ''}`).value.trim();
      dimensions = `${width} x ${depth} feet`;
      passengerCapacity = form.querySelector(`#newPassengerCapacity${formType === 'service' ? 'Service' : ''}`).value.trim();
      passengers2 = form.querySelector(`#newPassengers2${formType === 'service' ? 'Service' : ''}`).value.trim();
      pitSize = form.querySelector(`#newPitSize${formType === 'service' ? 'Service' : ''}`).value.trim();
      headRoom = form.querySelector(`#newHeadRoom${formType === 'service' ? 'Service' : ''}`).value.trim();
      doorType = form.querySelector(`#newDoorType${formType === 'service' ? 'Service' : ''}`).value.trim();
  
      // Convert feet to mm (1 foot = 304.8 mm)
      const widthMm = (parseFloat(width) * 304.8).toFixed(2);
      const depthMm = (parseFloat(depth) * 304.8).toFixed(2);
      dimensions += ` (${widthMm} mm x ${depthMm} mm)`;
    }
  
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const gpsLocation = `Check out this location: ${googleMapsUrl}`;
  
    let whatsappMessage = `Name: ${encodeURIComponent(name)}%0AAddress: ${encodeURIComponent(address)}%0APhone Number: ${encodeURIComponent(phoneNumber)}%0AEmail: ${encodeURIComponent(email)}%0AMessage: ${encodeURIComponent(message)}%0AGeoLocation: ${encodeURIComponent(gpsLocation)}%0A`;
  
    whatsappMessage += `Elevator Type: ${encodeURIComponent(elevatorType)}%0A`;
    whatsappMessage += `Type of Lift: ${encodeURIComponent(liftType)}%0A`;
    whatsappMessage += `Number of Floors: ${encodeURIComponent(floors)}%0A`;
    whatsappMessage += `Dimensions: ${encodeURIComponent(dimensions)}%0A`;
    if (elevatorType === 'existing' || elevatorType === 'existingService') {
      whatsappMessage += `Made: ${encodeURIComponent(made)}%0A`;
    }
    whatsappMessage += `Passenger Capacity: ${encodeURIComponent(passengerCapacity)} kg%0A`;
    whatsappMessage += `Number of Passengers (Confirm): ${encodeURIComponent(passengers2)}%0A`;
    whatsappMessage += `Type of Door: ${encodeURIComponent(doorType)}%0A`;
  
    const phoneNumberWhatsApp = '917842137763'; // Replace with your phone number
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumberWhatsApp}&text=${whatsappMessage}`;
  
    window.open(whatsappUrl, '_blank');
  
    // Prepare data for Google Sheets
    const data = {
      name,
      address,
      phoneNumber,
      email,
      message,
      elevatorType,
      liftType,
      floors,
      made,
      dimensions,
      passengerCapacity,
      passengers2,
      pitSize,
      headRoom,
      doorType,
      latitude,
      longitude,
      formType
    };
  
    sendToGoogleSheets(data);
  }
  
  function sendToGoogleSheets(data) {
    fetch('https://script.google.com/macros/s/AKfycbxr_KgXWoR5PZYpaJQmYUtOkQgrZjoAVGryhfhPyrmFJEiUF4-rWV9831mvmCWJz57l/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log('Success:', result);
    })
    .catch(error => {
      console.error('Error sending data to Google Sheets:', error);
    });
  }