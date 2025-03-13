function mouseTilt(domain, tiltBox, a, b) {
  let targetTiltX = 0, targetTiltY = 0;
  let currentTiltX = 0, currentTiltY = 0;
  let animationFrame;

  function updateTilt() {

    currentTiltX += (targetTiltX - currentTiltX) * 0.1;
    currentTiltY += (targetTiltY - currentTiltY) * 0.1;


    tiltBox.style.transform = `skewX(${currentTiltX}deg) skewY(${currentTiltY}deg)`;

    let normalizedBrightness = ((-currentTiltY - (-30)) / (30 - (-30))) * (1 - 0.3) + 0.3;
    let normalizedOpacity = ((-currentTiltY - (-30)) / (30 - (-30))) * 1;
    let nSepia = ((-currentTiltY - (-30)) / (30 - (-30))) * (0.1 - 1) + 1;
    let nGrayscale = ((-currentTiltY - (-30)) / (30 - (-30))) * (0.1 - 1) + 1;

    tiltBox.style.filter = `sepia(${nSepia}) grayscale(${nGrayscale}) brightness(${normalizedBrightness})`;
    console.log(tiltBox.style.filter);
    console.log(normalizedOpacity, normalizedBrightness);
    tiltBox.style.setProperty('--after-opacity', normalizedOpacity);
    tiltBox.style.setProperty('--after-brightness', normalizedBrightness);
    tiltBox.style.setProperty('--skew-x', `${-0.8 * currentTiltX}deg`);
    tiltBox.style.setProperty('--skew-y', `${-0.8 * currentTiltY}deg`);

    animationFrame = requestAnimationFrame(updateTilt);
  }

  domain.addEventListener("mousemove", (e) => {
    let box = tiltBox.getBoundingClientRect();
    console.log(e.clientX, box.left, box.width);
    let x = (e.clientX - box.left) / box.width - 0.5;
    let y = (e.clientY - box.top) / box.height - 0.5;

    console.log(x,y);

    targetTiltX = y * -a;
    targetTiltY = x * b;

    if (!animationFrame) updateTilt(); 
  });

  domain.addEventListener("mouseleave", () => {
    targetTiltX = 0;
    targetTiltY = 0; 
  });
}

window.addEventListener("load", function () {
  let loadingScreen = document.getElementById("loading-screen");
  let blurredBackground = document.querySelector(".blurred-background");
  let content = document.getElementById("content");
  let welcomeText = document.getElementById("welcome-text");
  let transitionedText = document.querySelectorAll(".textTransition");

  if (loadingScreen && content) {
      
      welcomeText.style.opacity = "1";
      welcomeText.style.transform = "skew(0deg, 0deg)";
      loadingScreen.style.pointerEvents = "none";
      setTimeout(() => {
          transitionedText.forEach((e, index) => {
            setTimeout(() => {
              e.style.clipPath = "xywh(0px 0px 100% 100%)"
            }, index * 100)
          });

          content.style.display = "block";
          Object.assign(blurredBackground.style, {
            filter: "blur(2px) brightness(1)",
            clipPath: "circle(25%)",
            transform: "translateX(140vh)",
            PointerEvent: "none",
          });
          Object.assign(welcomeText.style, {
            scale: "2",
            transform: "skew(180deg, 360deg)",
            opacity: "0"
          });

          setTimeout(() => {
              loadingScreen.style.display = "none";
              content.style.display = "block";
              
          }, 1500);
      }, 3000);
  }

  let headerPart1 = document.querySelector('.header-part1');
  let profile = document.querySelectorAll('.profile');


  mouseTilt(headerPart1, profile[0], 20, 20);
  mouseTilt(headerPart1, profile[1], -20, -20);
  mouseTilt(headerPart1, profile[2], 20, 20);

  const fixedDiv = document.getElementById("go-back");
  const triggerDiv = document.getElementById("all-parts");

  const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
            fixedDiv.style.opacity = 1;
            fixedDiv.style.pointerEvents = 'initial';
          } else {
            fixedDiv.style.opacity = 0;
            fixedDiv.style.pointerEvents = '';
          }
      });
    }, { threshold: 0 }); // Triggers as soon as it appears

    observer.observe(triggerDiv);

  let resizeTimeout;
  window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
          document.querySelectorAll(".journey-card").forEach((card) => {
              if (card.style.position === "fixed") {
                  if (window.matchMedia("(min-width: 768px)").matches) {
                      card.style.width = `24em`; 
                      card.style.height = `36em`;
                  } else {
                      card.style.width = `90%`;
                      card.style.height = `70%`;
                      card.style.transform = `translate(-50%, -50%)`;
                  }
              } else {
                  if (window.matchMedia("(min-width: 768px)").matches) {
                      card.style.width = "27%";
                      card.style.height = "20%";
                  } else {
                      card.style.width = "80%";
                      card.style.height = "8%";
                  }
              }
          });
      }, 200); 
  });



  document.querySelectorAll(".journey-card").forEach((card) => {

    let content = card.querySelector(".content");

    card.addEventListener("click", function () {
      let rect = this.getBoundingClientRect();
      let allCards = document.querySelectorAll(".journey-card");

      content.style.animation = "none";
      this.style.animation = "none";
  
      if (this.dataset.toggled === "true") {
        let journeyParent = document.querySelector(".journey-part2");
        let parentRect = journeyParent.getBoundingClientRect();

        const relativeX = rect.left - parentRect.left;
        const relativeY = rect.top - parentRect.top;

        setTimeout(() => {
          this.style.position = "absolute";

          if (window.matchMedia('(min-width: 768px)').matches) {
            this.style.setProperty('--initial-last-transform', `translate(0)`);
          } else {
            this.style.setProperty('--initial-last-transform', `translateX(0)`);
          }
          this.style.setProperty('--initial-last-top', `${relativeY}px`);
          this.style.setProperty('--initial-last-left', `${relativeX}px`);

          this.style.top = this.dataset.origTop;
          this.style.left = this.dataset.origLeft;

          if (window.matchMedia('(min-width: 768px)').matches) {
            this.style.width = "27%";
            this.style.height = "20%";
          } else {
            this.style.width = "80%";
            this.style.height = "8%";
          }

          content.style.animation = "spinToShow 1s linear reverse";
          this.style.animation = "moveReverse 1s linear forwards";
          setTimeout(() => {
            this.style.zIndex = '1';  
          }, 1000)
    
        }, 10);
  
        this.dataset.toggled = "false";
        
        allCards.forEach((c) => {
          c.style.pointerEvents = "auto";
        });
      } else {
  
        this.dataset.origTop = `${getComputedStyle(this).top}`;
        this.dataset.origLeft = `${getComputedStyle(this).left}`;

        if (window.matchMedia('(min-width: 768px)').matches) {
          this.dataset.origWidth = "27%";
          this.dataset.origHeight = "20%";
        } else {
          this.dataset.origWidth = "80%";
          this.dataset.origHeight = "8%";
        }
  
        setTimeout(() => {
          this.style.position = "fixed";
          this.style.top = `${rect.top}px`;
          this.style.left = `${rect.left}px`;

          if (window.matchMedia('(min-width: 768px)').matches) {
            this.style.width = `24em`;
            this.style.height = `36em`;
          } else {
            this.style.width = `90%`;
            this.style.height = `70%`;
            this.style.transform = `translate(-50%,-50%)`;
          }

            this.style.setProperty('--initial-last-top', `50%`);
            this.style.setProperty('--initial-last-left', `50%`);
            this.style.setProperty('--initial-last-transform', `translate(-50%, -50%)`);
     
          this.style.zIndex = '100';
  
          content.style.animation = "spinToShow 1.5s linear forwards";
          this.style.animation = "move 1.5s linear forwards";
        }, 10);
  
        this.dataset.toggled = "true";
        allCards.forEach((c) => {
          if (c !== this) c.style.pointerEvents = "none";
        });
      }
    });
  });

});
