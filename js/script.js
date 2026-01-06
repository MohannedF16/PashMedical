document.addEventListener('DOMContentLoaded', function() {
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  // Back to top functionality
  document.querySelector('.back-to-top').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });

  // State coverage map functionality
  const stateInfo = document.getElementById('state-info');
  const stateName = document.getElementById('state-name');
  const stateStatus = document.getElementById('state-status');
  const facilityCount = document.getElementById('facility-count');
  const professionalCount = document.getElementById('professional-count');
  const lastTraining = document.getElementById('last-training');
  const upcomingEvents = document.getElementById('upcoming-events');
  
  // State data
  const stateData = {
    'SD-KH': { // Khartoum
      name: 'Khartoum',
      covered: true,
      facilities: 42,
      professionals: 1250,
      lastTraining: 'July 2023',
      upcomingEvents: 3
    },
    'SD-GZ': { // Al Jazīrah
      name: 'Al Jazīrah',
      covered: true,
      facilities: 25,
      professionals: 680,
      lastTraining: 'April 2023',
      upcomingEvents: 1
    },
    'SD-GD': { // Al Qaḑārif
      name: 'Al Qaḑārif',
      covered: true,
      facilities: 15,
      professionals: 340,
      lastTraining: 'September 2023',
      upcomingEvents: 2
    },
    'SD-KA': { // Kassalā
      name: 'Kassalā',
      covered: true,
      facilities: 14,
      professionals: 310,
      lastTraining: 'August 2023',
      upcomingEvents: 1
    },
    'SD-RS': { // Red Sea
      name: 'Red Sea',
      covered: true,
      facilities: 8,
      professionals: 150,
      lastTraining: 'August 2023',
      upcomingEvents: 0
    },
    'SD-NR': { // River Nile
      name: 'River Nile',
      covered: true,
      facilities: 18,
      professionals: 320,
      lastTraining: 'June 2023',
      upcomingEvents: 2
    },
    'SD-NW': { // White Nile
      name: 'White Nile',
      covered: true,
      facilities: 18,
      professionals: 320,
      lastTraining: 'June 2023',
      upcomingEvents: 2
    },
    'SD-NO': { // Northern
      name: 'Northern',
      covered: true,
      facilities: 12,
      professionals: 240,
      lastTraining: 'May 2023',
      upcomingEvents: 1
    },
    'SD-NB': { // Blue Nile
      name: 'Blue Nile',
      covered: true,
      facilities: 10,
      professionals: 180,
      lastTraining: 'March 2023',
      upcomingEvents: 1
    },
    'SD-KN': { // North Kurdufān
      name: 'North Kurdufān',
      covered: false,
      facilities: 11,
      professionals: 240,
      lastTraining: 'Planned: Q2 2024',
      upcomingEvents: 0
    },
    'SD-DN': { // North Darfur
      name: 'North Darfur',
      covered: false,
      facilities: 9,
      professionals: 190,
      lastTraining: 'Planned: Q2 2024',
      upcomingEvents: 0
    },
    'SD-SI': { // Sennar
      name: 'Sennar',
      covered: false,
      facilities: 12,
      professionals: 260,
      lastTraining: 'Planned: Q4 2023',
      upcomingEvents: 0
    }
  };

  // Add covered class to states that are covered
  document.querySelectorAll('.state').forEach(state => {
    const stateId = state.id;
    if (stateData[stateId] && stateData[stateId].covered) {
      state.classList.add('covered');
    }
  });

  // Add event listeners to all states
  document.querySelectorAll('.state').forEach(state => {
    state.addEventListener('mouseenter', function(e) {
      const stateId = this.id;
      const data = stateData[stateId];
      
      if (data) {
        stateName.textContent = data.name;
        
        if (data.covered) {
          stateStatus.textContent = "Covered";
          stateStatus.className = "status-badge covered-badge";
        } else {
          stateStatus.textContent = "Coming Soon";
          stateStatus.className = "status-badge uncovered-badge";
        }
        
        facilityCount.textContent = data.facilities;
        professionalCount.textContent = data.professionals;
        lastTraining.textContent = data.lastTraining;
        upcomingEvents.textContent = data.upcomingEvents;
        
        // Position the info box near the cursor
        stateInfo.style.display = 'block';
        stateInfo.style.left = `${e.clientX + 20}px`;
        stateInfo.style.top = `${e.clientY + 20}px`;
      }
    });

    state.addEventListener('mouseleave', function() {
      stateInfo.style.display = 'none';
    });
    
    // Add click effect for better feedback
    state.addEventListener('click', function() {
      this.classList.add('state-highlight');
      setTimeout(() => this.classList.remove('state-highlight'), 300);
    });
  });

  // Move the info box with the mouse
  document.addEventListener('mousemove', function(e) {
    if (stateInfo.style.display === 'block') {
      stateInfo.style.left = `${e.clientX + 20}px`;
      stateInfo.style.top = `${e.clientY + 20}px`;
    }
  });
  
  // Initialize Pie Chart
  const chartCanvas = document.getElementById('coverage-chart');
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');
    const coverageChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Covered States', 'Uncovered States'],
        datasets: [{
          label: 'Sudan Coverage',
          data: [8, 10],
          backgroundColor: [
            'rgba(76, 175, 80, 0.8)',
            'rgba(224, 224, 224, 0.8)'
          ],
          borderColor: [
            'rgba(76, 175, 80, 1)',
            'rgba(224, 224, 224, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: true,
          animateScale: false
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14
              },
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} states (${percentage}%)`;
              }
            }
          },
          title: {
            display: true,
            text: 'Sudan State Coverage',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          }
        }
      }
    });
  }
  
  // Form submission
  document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will contact you soon.');
    this.reset();
  });

  // Job slider navigation with auto-slide
  const sliderTrack = document.querySelector('.slider-track');
  const sliderPrev = document.querySelector('.slider-prev');
  const sliderNext = document.querySelector('.slider-next');

  if (sliderTrack && sliderPrev && sliderNext) {
      // Calculate slide width
      const slide = document.querySelector('.job-slide');
      if (slide) {
          const slideStyle = getComputedStyle(slide);
          const slideWidth = slide.offsetWidth + parseInt(slideStyle.marginRight);

          // Manual navigation
          sliderPrev.addEventListener('click', () => {
              sliderTrack.scrollBy({ left: -slideWidth, behavior: 'smooth' });
          });

          sliderNext.addEventListener('click', () => {
              sliderTrack.scrollBy({ left: slideWidth, behavior: 'smooth' });
          });

          // Auto slider functionality
          let slideInterval;

          function startAutoSlide() {
              slideInterval = setInterval(() => {
                  const nextScrollLeft = sliderTrack.scrollLeft + slideWidth;
                  const maxScrollLeft = sliderTrack.scrollWidth - sliderTrack.clientWidth;
                  
                  if (nextScrollLeft >= maxScrollLeft) {
                      // Reset to the beginning
                      sliderTrack.scrollTo({ left: 0, behavior: 'smooth' });
                  } else {
                      sliderTrack.scrollBy({ left: slideWidth, behavior: 'smooth' });
                  }
              }, 5000); // Change slide every 5 seconds
          }

          function stopAutoSlide() {
              clearInterval(slideInterval);
          }

          // Start auto slide
          startAutoSlide();

          // Pause auto slide on hover
          sliderTrack.addEventListener('mouseenter', stopAutoSlide);
          sliderTrack.addEventListener('mouseleave', startAutoSlide);

          // Also pause when user interacts with controls
          sliderPrev.addEventListener('mouseenter', stopAutoSlide);
          sliderNext.addEventListener('mouseenter', stopAutoSlide);
          sliderPrev.addEventListener('mouseleave', startAutoSlide);
          sliderNext.addEventListener('mouseleave', startAutoSlide);
      }
  }
  
});