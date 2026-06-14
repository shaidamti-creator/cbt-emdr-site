document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-nav-active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (mainNav.classList.contains('mobile-nav-active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });
    }

    // Close mobile menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav && mainNav.classList.contains('mobile-nav-active')) {
                mainNav.classList.remove('mobile-nav-active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    });

    // 3. Scroll Spy (Highlight active nav link on scroll)
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for header height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 4. FAQ Accordion Toggles
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle active on clicked item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // 5. Interactive Self-Assessment Wizard
    let currentStep = 1;
    const totalSteps = 3;
    const answers = { 1: null, 2: null, 3: null };
    
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const stepNumberText = document.getElementById('step-number-text');
    const progressPercentText = document.getElementById('step-progress-percent');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const stepNavigationActions = document.getElementById('step-navigation-actions');
    
    // Recommendations database
    const recommendations = {
        cbt: {
            title: "טיפול CBT קוגניטיבי התנהגותי",
            subjectValue: "טיפול רגשי CBT/EMDR",
            details: "שיטת טיפול ממוקדת, קצרת מועד ומכוונת מטרה, המתאימה במיוחד להפחתת חרדה, טיפול במחשבות טורדניות (OCD), פוביות שונות ודיכאון. בטיפול נלמד לזהות דפוסי חשיבה מעכבים ולשנות הרגלים התנהגותיים הפוגעים באיכות החיים."
        },
        emdr: {
            title: "טיפול בשיטת EMDR",
            subjectValue: "טיפול רגשי CBT/EMDR",
            details: "שיטה ייחודית מבוססת מחקר לעיבוד מיומן של חוויות קשות או טראומות מן העבר שעדיין משפיעות עליך בהווה. באמצעות גירוי דו-צדדי, הטיפול עוזר להפחית את הכאב הרגשי ולהחזיר את השלווה והחוסן."
        },
        art: {
            title: "טיפול באומנות בשילוב CBT",
            subjectValue: "טיפול רגשי CBT/EMDR",
            details: "שילוב המציע מרחב רגשי, משחקי ויצירתי דרך חומרי אמנות לעיבוד תחושות פנימיות ועקיפת מגננות דיבור, בשילוב כלים פרקטיים של CBT. מתאים מאוד למעוניינים בהבעה חזותית ועיבוד רגשי עמוק."
        },
        parenting: {
            title: "הנחיית הורים ממוקדת",
            subjectValue: "הדרכת הורים",
            details: "תהליך ליווי והדרכה מעשי שמטרתו להעניק לך כלים לביסוס סמכות הורית מטיבה ומקרבת, פתרון בעיות התנהגות או פחדים אצל ילדיך, וחיזוק התקשורת החיובית באקלים המשפחתי בבית."
        }
    };

    // Selection buttons event listeners
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = parseInt(btn.getAttribute('data-step'), 10);
            const value = btn.getAttribute('data-value');
            
            // Store answer
            answers[step] = value;
            
            // Toggle selection visuals in current step
            const currentStepContainer = document.getElementById(`step-${step}`);
            const siblings = currentStepContainer.querySelectorAll('.option-btn');
            siblings.forEach(sib => sib.classList.remove('selected'));
            btn.classList.add('selected');
            
            // Enable Next button
            if (nextBtn) {
                nextBtn.disabled = false;
            }
        });
    });

    // Update wizard step visuals
    function updateStepVisuals() {
        // Hide all steps
        for (let i = 1; i <= totalSteps; i++) {
            const stepElem = document.getElementById(`step-${i}`);
            if (stepElem) stepElem.classList.add('hidden');
        }
        const resultElem = document.getElementById('step-result');
        if (resultElem) resultElem.classList.add('hidden');
        
        // Show current step or result
        if (currentStep <= totalSteps) {
            const activeStepElem = document.getElementById(`step-${currentStep}`);
            if (activeStepElem) activeStepElem.classList.remove('hidden');
            
            // Progress details
            const percent = Math.round(((currentStep - 1) / totalSteps) * 100) + 10;
            if (progressBarFill) progressBarFill.style.width = `${percent}%`;
            if (stepNumberText) stepNumberText.textContent = `שאלה ${currentStep} מתוך ${totalSteps}`;
            if (progressPercentText) progressPercentText.textContent = `${percent}% הושלמו`;
            
            // Enable/Disable navigation buttons
            if (prevBtn) prevBtn.disabled = currentStep === 1;
            if (nextBtn) {
                nextBtn.textContent = currentStep === totalSteps ? "הצג המלצה" : "המשך";
                nextBtn.disabled = !answers[currentStep]; // Disable if no answer yet
            }
            if (stepNavigationActions) stepNavigationActions.classList.remove('hidden');
        } else {
            // Result screen
            if (resultElem) resultElem.classList.remove('hidden');
            if (progressBarFill) progressBarFill.style.width = `100%`;
            if (stepNumberText) stepNumberText.textContent = `השאלון הושלם!`;
            if (progressPercentText) progressPercentText.textContent = `100%`;
            if (stepNavigationActions) stepNavigationActions.classList.add('hidden');
            
            calculateRecommendation();
        }
    }

    // Algorithm to calculate final recommendation
    function calculateRecommendation() {
        const counts = { cbt: 0, emdr: 0, art: 0, parenting: 0 };
        
        // Count frequencies of selected approaches
        for (let i = 1; i <= totalSteps; i++) {
            const val = answers[i];
            if (val && counts[val] !== undefined) {
                counts[val]++;
            }
        }
        
        // Find maximum value
        let recommendedKey = 'cbt'; // Default fallback
        let maxCount = -1;
        
        // Find which is the highest
        for (const [key, count] of Object.entries(counts)) {
            if (count > maxCount) {
                maxCount = count;
                recommendedKey = key;
            } else if (count === maxCount) {
                // If there's a tie, give weight to the first question (the primary challenge)
                if (answers[1] === key) {
                    recommendedKey = key;
                }
            }
        }
        
        // Render recommended information
        const rec = recommendations[recommendedKey];
        const tagElem = document.getElementById('recommendation-tag');
        const headerElem = document.getElementById('recommendation-header');
        const detailsElem = document.getElementById('recommendation-details');
        
        if (tagElem) tagElem.textContent = rec.title;
        if (headerElem) headerElem.innerHTML = `<i data-lucide="info"></i> למה זה מתאים לך?`;
        if (detailsElem) detailsElem.textContent = rec.details;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Save recommended option on button click
        const applyBtn = document.getElementById('apply-recommendation-btn');
        if (applyBtn) {
            applyBtn.onclick = () => {
                // Prefill contact form
                const nameInput = document.getElementById('form-name');
                const subjectSelect = document.getElementById('form-subject');
                const messageTextarea = document.getElementById('form-message');
                
                if (subjectSelect) {
                    subjectSelect.value = rec.subjectValue;
                }
                
                if (messageTextarea) {
                    messageTextarea.value = `שלום בת-חן,\nביצעתי את שאלון ההתאמה באתר והתוצאה המומלצת עבורי היא: ${rec.title}.\nאשמח לתאם עמך שיחת ייעוץ ראשונית לטיפול.`;
                }
                
                // Scroll to contact form
                const contactSec = document.getElementById('contact');
                if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Focus on Name input
                if (nameInput) {
                    setTimeout(() => nameInput.focus(), 800);
                }
            };
        }
    }

    // Navigation buttons wiring
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep <= totalSteps && answers[currentStep]) {
                currentStep++;
                updateStepVisuals();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepVisuals();
            }
        });
    }

    // Restart button wiring
    const restartBtn = document.getElementById('restart-assessment-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            currentStep = 1;
            answers[1] = null;
            answers[2] = null;
            answers[3] = null;
            
            // Clear selections in buttons
            optionButtons.forEach(btn => btn.classList.remove('selected'));
            
            updateStepVisuals();
        });
    }

    // 6. Contact Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    const statusContainer = document.getElementById('form-status-container');
    const formSubmitBtn = document.getElementById('form-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Hide previous messages
            if (statusContainer) {
                statusContainer.classList.add('hidden');
                statusContainer.innerHTML = '';
            }
            
            // Disable submit button during fetch
            if (formSubmitBtn) {
                formSubmitBtn.disabled = true;
                formSubmitBtn.textContent = 'שולח הודעה...';
            }
            
            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value.trim();
            
            try {
                const response = await fetch('https://formsubmit.co/ajax/bdavidi24@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        email: email,
                        subject: subject,
                        message: message,
                        _subject: `פנייה חדשה מהאתר: ${subject} (${name})`,
                        _captcha: "false" // Disable captcha for AJAX
                    })
                });
                
                const data = await response.json();
                
                if (statusContainer) {
                    statusContainer.classList.remove('hidden');
                    if (response.ok && (data.success === "true" || data.success === true)) {
                        statusContainer.className = 'form-status success';
                        statusContainer.innerHTML = `<i data-lucide="check"></i> <span>תודה! הודעתך התקבלה בהצלחה. נחזור אליך בהקדם האפשרי.</span>`;
                        contactForm.reset();
                    } else {
                        statusContainer.className = 'form-status error';
                        statusContainer.innerHTML = `<i data-lucide="alert-triangle"></i> <span>אירעה שגיאה בשליחת הטופס. אנא נסו שנית.</span>`;
                    }
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            } catch (err) {
                console.error("Fetch error on submission:", err);
                if (statusContainer) {
                    statusContainer.classList.remove('hidden');
                    statusContainer.className = 'form-status error';
                    statusContainer.innerHTML = `<i data-lucide="alert-triangle"></i> <span>אירעה שגיאה בחיבור לשרת. נא לנסות שנית מאוחר יותר.</span>`;
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            } finally {
                if (formSubmitBtn) {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.textContent = 'שליחת הודעה';
                }
            }
        });
    }
});
