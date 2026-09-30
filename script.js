/* ==========================================================================
   LegacyLabs Master Application Script
   Powers: Filters, Lightbox Modal, Live Estimator & WhatsApp Generator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Portfolio Category Filtering
     ------------------------------------------------------------------------ */
  const portfolioFilterBtns = document.querySelectorAll('#portfolio-filters .filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and add to clicked
      portfolioFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === itemCategory) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease-in-out';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });


  /* ------------------------------------------------------------------------
     2. Portfolio Lightbox Modal Functionality
     ------------------------------------------------------------------------ */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const closeLightboxBtn = document.getElementById('close-lightbox');

  // Open Lightbox on Portfolio Click
  document.querySelectorAll('.open-lightbox').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = button.closest('.portfolio-item');
      
      const imgSrc = parentCard.querySelector('img').src;
      const title = parentCard.querySelector('h3').innerText;
      const category = parentCard.querySelector('span').innerText;

      lightboxImg.src = imgSrc;
      lightboxTitle.innerText = title;
      lightboxCategory.innerText = category;

      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    });
  });

  // Close Lightbox Function
  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scrolling
    }
  };

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', closeLightbox);
  }

  // Close when clicking outside content box or pressing ESC key
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });


  /* ------------------------------------------------------------------------
     3. Equipment Arsenal Category Filtering
     ------------------------------------------------------------------------ */
  const equipmentFilterBtns = document.querySelectorAll('#equipment-filters .filter-btn');
  const equipmentCards = document.querySelectorAll('.equipment-card');

  equipmentFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      equipmentFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      equipmentCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === cardCategory) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* ------------------------------------------------------------------------
     4. Dynamic KES Package Cost Estimator
     ------------------------------------------------------------------------ */
  const serviceTypeSelect = document.getElementById('est-service');
  const daysSlider = document.getElementById('est-days');
  const daysValueDisplay = document.getElementById('days-val');
  const droneCheckbox = document.getElementById('est-drone');
  const totalCostDisplay = document.getElementById('estimated-total');

  // Base Prices in Kenyan Shillings (KES)
  const baseRates = {
    'wedding': 80000,
    'cultural': 60000,
    'corporate': 50000,
    'commercial': 75000
  };

  const droneDailyRate = 25000;

  function calculateTotalCost() {
    if (!serviceTypeSelect || !daysSlider || !totalCostDisplay) return;

    const selectedService = serviceTypeSelect.value;
    const days = parseInt(daysSlider.value) || 1;
    const includeDrone = droneCheckbox ? droneCheckbox.checked : false;

    // Update Days text counter
    if (daysValueDisplay) {
      daysValueDisplay.innerText = `${days} Day${days > 1 ? 's' : ''}`;
    }

    // Base calculation
    let basePrice = baseRates[selectedService] || 60000;
    let total = basePrice * days;

    // Add Drone Addon per day
    if (includeDrone) {
      total += (droneDailyRate * days);
    }

    // Format output with commas (e.g., KSh 145,000)
    totalCostDisplay.innerText = `KSh ${total.toLocaleString()}`;
  }

  // Attach event listeners for real-time recalculation
  if (serviceTypeSelect) serviceTypeSelect.addEventListener('change', calculateTotalCost);
  if (daysSlider) daysSlider.addEventListener('input', calculateTotalCost);
  if (droneCheckbox) droneCheckbox.addEventListener('change', calculateTotalCost);

  // Initial calculation run
  calculateTotalCost();


  /* ------------------------------------------------------------------------
     5. Booking Form WhatsApp Payload Generator
     ------------------------------------------------------------------------ */
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form inputs
      const clientName = document.getElementById('client-name').value.trim();
      const clientPhone = document.getElementById('client-phone').value.trim();
      const eventType = document.getElementById('event-type').value;
      const eventDate = document.getElementById('event-date').value;
      const eventLocation = document.getElementById('event-location').value.trim();
      const notes = document.getElementById('event-notes').value.trim();

      // Validation check
      if (!clientName || !clientPhone || !eventDate) {
        alert('Please fill in all required fields (Name, Phone, and Event Date).');
        return;
      }

      // Build structured WhatsApp message text
      const message = `*NEW BOOKING INQUIRY - LEGACYLABS MEDIA*%0A%0A` +
        `*Client Name:* ${encodeURIComponent(clientName)}%0A` +
        `*Phone:* ${encodeURIComponent(clientPhone)}%0A` +
        `*Service Type:* ${encodeURIComponent(eventType)}%0A` +
        `*Event Date:* ${encodeURIComponent(eventDate)}%0A` +
        `*Location:* ${encodeURIComponent(eventLocation || 'Not Specified')}%0A` +
        `*Estimated Investment:* ${encodeURIComponent(totalCostDisplay ? totalCostDisplay.innerText : 'Calculated on call')}%0A` +
        `*Additional Details:* ${encodeURIComponent(notes || 'None')}%0A%0A` +
        `_Sent directly from LegacyLabs Website Booking Engine_`;

      // Business WhatsApp Number (+254 712 345 678 -> 254712345678)
      const whatsappNumber = '254712345678';
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

      // Open WhatsApp in new tab
      window.open(whatsappURL, '_blank');
    });
  }


  /* ------------------------------------------------------------------------
     6. Mobile Navigation Menu Toggle
     ------------------------------------------------------------------------ */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('active');
    });

    // Close menu when clicking a link
    mobileNavDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('active');
      });
    });
  }

});