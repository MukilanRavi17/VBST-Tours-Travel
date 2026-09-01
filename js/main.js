/**
 * VBST Tour & Travels Agency - Interactive JavaScript
 * Veerabhadra Swamy Tours & Travels
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Mobile Navigation Menu Toggle ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = hamburgerBtn.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        const icon = hamburgerBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // --- 2. Hero Banner Slider (Manual Control Only) ---
  const slides = document.querySelectorAll('.slide-item');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  let currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) return;
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  if (slides.length > 0) {
    // Initial display
    showSlide(0);

    // Right Arrow: Show Next Image
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
      });
    }

    // Left Arrow: Show Previous Image
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
      });
    }

    // Pagination Dots
    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(i);
      });
    });
  }

  // --- 3. Interactive Booking Modal & Dynamic Pricing ---
  const bookingModal = document.getElementById('bookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const closeBookingModalBtn = document.getElementById('closeBookingModal');
  const tripSelect = document.getElementById('modalTripSelect');
  const vehicleSelect = document.getElementById('modalVehicleSelect');
  const peopleInput = document.getElementById('modalPeople');
  const estimatedPriceEl = document.getElementById('modalEstimatedPrice');

  // Base prices in INR for various trips/packages
  const tripBaseRates = {
    'kashmir': 18999,
    'kerala': 14499,
    'goa': 9999,
    'rajasthan': 16999,
    'manali': 11999,
    'ooty': 8499,
    'varanasi': 10499,
    'hyderabad': 4999,
    'tirupati': 6499,
    'leh': 24999,
    'darjeeling': 15999,
    'custom': 8000
  };

  const vehicleMultipliers = {
    'volvo': 1.4,
    'tempo': 1.2,
    'minibus': 1.3
  };

  function updatePriceEstimate() {
    if (!estimatedPriceEl) return;
    const selectedTrip = tripSelect ? tripSelect.value : 'kerala';
    const selectedVehicle = vehicleSelect ? vehicleSelect.value : 'tempo';
    const people = peopleInput ? parseInt(peopleInput.value) || 1 : 1;

    const baseRate = tripBaseRates[selectedTrip] || 12000;
    const vehicleMult = vehicleMultipliers[selectedVehicle] || 1.0;

    // Calculation: people * base package price * vehicle multiplier
    const totalEstimate = Math.round(people * baseRate * vehicleMult);
    estimatedPriceEl.textContent = 'Rs.' + totalEstimate.toLocaleString('en-IN');
  }

  // Hook up event listeners for inputs
  if (tripSelect) tripSelect.addEventListener('change', updatePriceEstimate);
  if (vehicleSelect) vehicleSelect.addEventListener('change', updatePriceEstimate);
  if (peopleInput) peopleInput.addEventListener('input', updatePriceEstimate);

  // Global Function to Open Booking Modal with trip pre-selection
  window.openBookingModal = function (tripKey = 'kerala', tripName = '') {
    if (!bookingModal) return;
    if (tripSelect && tripKey) {
      tripSelect.value = tripKey;
    }
    if (bookingForm) bookingForm.style.display = 'block';
    if (bookingSuccess) bookingSuccess.style.display = 'none';
    updatePriceEstimate();
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close booking modal
  if (closeBookingModalBtn) {
    closeBookingModalBtn.addEventListener('click', () => {
      bookingModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  // Close modal when clicking outside box
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // All "Book Now" buttons trigger modal
  document.querySelectorAll('.trigger-booking').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const trip = btn.getAttribute('data-trip') || 'kerala';
      const tripName = btn.getAttribute('data-trip-name') || '';
      openBookingModal(trip, tripName);
    });
  });

  // Handle Booking Form Submit
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value;
      const phone = document.getElementById('modalPhone').value;
      const email = document.getElementById('modalEmail').value;
      const date = document.getElementById('modalDate').value;
      const tripName = tripSelect ? tripSelect.options[tripSelect.selectedIndex].text : 'Indian Tour Package';
      const estPrice = estimatedPriceEl ? estimatedPriceEl.textContent : 'Rs.14,499';

      const bookingRef = 'VBST-' + Math.floor(100000 + Math.random() * 900000);
      const people = peopleInput ? peopleInput.value : '1';

      // Populate success view
      const refEl = document.getElementById('bookingRefCode');
      const summaryEl = document.getElementById('bookingSummaryDetails');
      if (refEl) refEl.textContent = bookingRef;
      if (summaryEl) {
        summaryEl.innerHTML = `
          <strong>Guest Name:</strong> ${name}<br>
          <strong>Trip:</strong> ${tripName}<br>
          <strong>No. of People:</strong> ${people}<br>
          <strong>Departure Date:</strong> ${date || 'Flexible'}<br>
          <strong>Estimated Cost:</strong> ${estPrice}<br>
          <strong>Contact:</strong> ${phone} | ${email}
        `;
      }

      bookingForm.style.display = 'none';
      if (bookingSuccess) bookingSuccess.style.display = 'block';
    });
  }

  // --- 4. Gallery Lightbox & Filtering ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentGalleryIndex = 0;
  let galleryArray = [];

  if (galleryItems.length > 0) {
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      const captionText = img ? (img.getAttribute('alt') || 'VBST Fleet & Tours') : 'VBST Fleet & Tours';
      galleryArray.push({
        src: img ? img.getAttribute('src') : '',
        caption: captionText
      });

      item.addEventListener('click', () => {
        currentGalleryIndex = index;
        openLightbox(currentGalleryIndex);
      });
    });
  }

  function openLightbox(index) {
    if (!lightboxModal || !galleryArray.length) return;
    if (index >= galleryArray.length) currentGalleryIndex = 0;
    else if (index < 0) currentGalleryIndex = galleryArray.length - 1;
    else currentGalleryIndex = index;

    lightboxImg.src = galleryArray[currentGalleryIndex].src;
    lightboxCaption.textContent = galleryArray[currentGalleryIndex].caption;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => openLightbox(currentGalleryIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => openLightbox(currentGalleryIndex + 1));

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(currentGalleryIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(currentGalleryIndex + 1);
    }
  });

  // Filter Tabs (for Gallery and Destinations)
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filterGroup = tab.getAttribute('data-group') || 'default';
      const category = tab.getAttribute('data-filter') || 'all';

      // Update active tab within the same group
      document.querySelectorAll(`.filter-tab[data-group="${filterGroup}"]`).forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter target items
      const targetItems = document.querySelectorAll(`.filterable-item[data-group="${filterGroup}"]`);
      targetItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category') || '';
        if (category === 'all' || itemCategory.includes(category)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // --- 5. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other FAQs
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // --- 6. Quick Booking Bar Search Trigger ---
  const quickSearchBtn = document.getElementById('quickSearchBtn');
  if (quickSearchBtn) {
    quickSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const destSelect = document.getElementById('quickDestination');
      const selectedDest = destSelect ? destSelect.value : 'kerala';
      openBookingModal(selectedDest);
    });
  }

  // --- 7. Contact Form Handler ---
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.reset();
      if (contactSuccess) {
        contactSuccess.style.display = 'block';
        setTimeout(() => {
          contactSuccess.style.display = 'none';
        }, 6000);
      }
    });
  }

  // --- 8. Package Day-by-Day Itinerary Accordion ---
  const itineraryToggleBtns = document.querySelectorAll('.itinerary-toggle-btn');
  itineraryToggleBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const targetCollapse = targetId ? document.getElementById(targetId) : btn.nextElementSibling;
      const textSpan = btn.querySelector('.toggle-text');

      if (targetCollapse) {
        const isOpen = targetCollapse.classList.contains('open');
        if (isOpen) {
          targetCollapse.classList.remove('open');
          btn.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
          if (textSpan) {
            textSpan.textContent = 'View Day-by-Day Plan';
          }
        } else {
          targetCollapse.classList.add('open');
          btn.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          if (textSpan) {
            textSpan.textContent = 'Hide Day-by-Day Plan';
          }
        }
      }
    });
  });
});