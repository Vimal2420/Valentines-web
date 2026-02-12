// ===========================
// Configuration
// ===========================
const CONFIG = {
    instagram_handle: '_viimal',
    no_button_min_distance: 50, // Minimum pixels to move the button
    button_container_padding: 20, // Padding inside the container
    disable_evasion_below_width: 360, // Disable evasion on very small screens
    throttle_delay: 50, // Milliseconds between evasion actions
};

// ===========================
// Utility Functions
// ===========================

/**
 * Throttle function to prevent excessive event firing
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
}

/**
 * Get random integer between min and max
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Check if device has touch capability
 */
function isTouchDevice() {
    return (
        (typeof window !== 'undefined' &&
            ('ontouchstart' in window ||
                (window.DocumentTouch && document instanceof window.DocumentTouch)))
    );
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get a new random position for the button
 * Can go anywhere on the screen (within viewport bounds)
 */
function getNewButtonPosition(button, container) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonRect = button.getBoundingClientRect();
    
    const maxX = viewportWidth - buttonRect.width - 20;
    const maxY = viewportHeight - buttonRect.height - 20;
    
    const minX = 20;
    const minY = 20;
    
    let newX = getRandomInt(minX, Math.max(maxX, minX + 50));
    let newY = getRandomInt(minY, Math.max(maxY, minY + 50));
    
    return { x: Math.max(minX, Math.min(newX, maxX)), y: Math.max(minY, Math.min(newY, maxY)) };
}

/**
 * Move the NO button to a new position
 */
function moveNoButton(button, container) {
    if (prefersReducedMotion()) return;
    
    // Disappear
    button.style.opacity = '0';
    button.style.transition = 'opacity 0.2s ease';
    
    // Wait for disappear, then reposition and reappear
    setTimeout(() => {
        const { x, y } = getNewButtonPosition(button, container);
        button.style.position = 'fixed';
        button.style.left = x + 'px';
        button.style.top = y + 'px';
        
        // Reappear
        setTimeout(() => {
            button.style.opacity = '1';
        }, 10);
    }, 200);
    
    // Add visual feedback
    button.style.boxShadow = '0 6px 20px rgba(194, 22, 22, 0.6)';
}

/**
 * Reset NO button position
 */
function resetNoButton(button) {
    button.style.position = '';
    button.style.left = '';
    button.style.top = '';
    button.style.boxShadow = '';
    button.style.opacity = '1';
    button.style.transition = '';
}

/**
 * Swap YES and NO button positions (for touch devices)
 */
function swapButtonPositions(yesBtn, noBtn) {
    if (prefersReducedMotion()) return;
    
    const yesRect = yesBtn.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();
    
    const xDiff = yesRect.left - noRect.left;
    const yDiff = yesRect.top - noRect.top;
    
    noBtn.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
    yesBtn.style.transform = `translate(${-xDiff}px, ${-yDiff}px)`;
}

/**
 * Reset button positions
 */
function resetButtonPositions(yesBtn, noBtn) {
    yesBtn.style.transform = 'translate(0, 0)';
    noBtn.style.transform = 'translate(0, 0)';
}

// ===========================
// Main Initialization
// ===========================

document.addEventListener('DOMContentLoaded', function () {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const buttonContainer = document.querySelector('.button-container');
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    
    if (!yesBtn || !noBtn || !buttonContainer) return;
    
    // Disable evasion on very small screens
    const isSmallScreen = window.innerWidth < CONFIG.disable_evasion_below_width;
    const shouldEvadesNo = !isSmallScreen && !prefersReducedMotion();
    
    // ===========================
    // Page Navigation (Toggle)
    // ===========================
    
    yesBtn.addEventListener('click', () => {
        // Hide page 1, show page 2
        page1.classList.add('hidden');
        page2.classList.remove('hidden');
    });
    
    // ===========================
    // Mouse & Pointer Events
    // ===========================
    
    if (shouldEvadesNo) {
        // Desktop: instant hover evasion (no throttle)
        noBtn.addEventListener('mouseenter', () => {
            moveNoButton(noBtn, buttonContainer);
        });
        
        noBtn.addEventListener('mouseover', () => {
            moveNoButton(noBtn, buttonContainer);
        });
        
        noBtn.addEventListener('mousemove', () => {
            moveNoButton(noBtn, buttonContainer);
        });
        
        // Reset when mouse leaves
        noBtn.addEventListener('mouseleave', () => {
            resetNoButton(noBtn);
        });
        noBtn.addEventListener('mouseout', () => {
            resetNoButton(noBtn);
        });
    }
    
    // ===========================
    // Touch Events (Mobile)
    // ===========================
    
    if (shouldEvadesNo && isTouchDevice()) {
        const throttledSwap = throttle(() => {
            swapButtonPositions(yesBtn, noBtn);
            // Reset after a short delay to confuse further attempts
            setTimeout(() => {
                resetButtonPositions(yesBtn, noBtn);
            }, 400);
        }, CONFIG.throttle_delay);
        
        noBtn.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent default touch behavior
            throttledSwap();
        });
        
        noBtn.addEventListener('touchmove', (e) => {
            e.preventDefault();
            throttledSwap();
        });
    }
    
    // ===========================
    // Click Prevention
    // ===========================
    
    noBtn.addEventListener('click', (e) => {
        // Prevent default click
        e.preventDefault();
        e.stopPropagation();
        
        if (shouldEvadesNo) {
            // Instantly change position on click attempt
            moveNoButton(noBtn, buttonContainer);
            
            // Shake the button playfully
            noBtn.style.animation = 'none';
            setTimeout(() => {
                noBtn.style.animation = 'evade 0.4s ease-out';
            }, 10);
        }
        
        // Visual feedback
        if (!prefersReducedMotion()) {
            noBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                noBtn.style.transform = 'scale(1)';
            }, 200);
        }
        
        return false;
    });
    
    // ===========================
    // YES Button Navigation
    // ===========================
    
    yesBtn.addEventListener('click', () => {
        // Smooth transition to congratulations page
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            window.location.href = 'congrats.html';
        }
    });
    
    // ===========================
    // Copy to Clipboard (Congrats Page)
    // ===========================
    
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                const handle = CONFIG.instagram_handle;
                await navigator.clipboard.writeText(`@${handle}`);
                
                // Visual feedback
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✓ Copied!';
                copyBtn.style.backgroundColor = 'rgba(194, 22, 22, 0.2)';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.backgroundColor = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                copyBtn.textContent = '✗ Failed';
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy Handle';
                }, 2000);
            }
        });
    }
    
    // ===========================
    // Keyboard Accessibility
    // ===========================
    
    document.addEventListener('keydown', (e) => {
        // Allow Enter/Space to activate focused button
        if ((e.key === 'Enter' || e.key === ' ') && noBtn === document.activeElement) {
            e.preventDefault();
            // Don't navigate on NO button keyboard press
            // The evasion CSS will still apply
        }
    });
    
    // ===========================
    // Window Resize Handler
    // ===========================
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Check if we've crossed the small-screen threshold
            const newIsSmallScreen = window.innerWidth < CONFIG.disable_evasion_below_width;
            if (newIsSmallScreen !== isSmallScreen) {
                location.reload(); // Reload to reset button behavior
            }
            // Reset button positions on resize
            resetNoButton(noBtn);
            resetButtonPositions(yesBtn, noBtn);
        }, 250);
    });
    
    // ===========================
    // Screen Reader Announcements
    // ===========================
    
    // Add aria-live region for screen reader updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
    
    if (shouldEvadesNo && noBtn) {
        noBtn.setAttribute('aria-label', 'No button (This button will try to evade your clicks!)');
    }
});

// ===========================
// Instagram Handle Substitution
// ===========================

// Update Instagram handle throughout the page on load
document.addEventListener('DOMContentLoaded', () => {
    const handle = CONFIG.instagram_handle;
    
    // Update all instances in the DOM
    document.querySelectorAll('.handle').forEach((el) => {
        el.textContent = `@${handle}`;
    });
    
    // Update Instagram link
    const instaLink = document.querySelector('.btn-instagram');
    if (instaLink) {
        instaLink.href = `https://www.instagram.com/${handle}/`;
        // Try app scheme first (for mobile), fallback to web
        instaLink.addEventListener('click', (e) => {
            if (isTouchDevice()) {
                e.preventDefault();
                // Try to open with app scheme
                window.location.href = `instagram://user?username=${handle}`;
                // Fallback to web after a short delay
                setTimeout(() => {
                    window.location.href = `https://www.instagram.com/${handle}/`;
                }, 1000);
            }
        });
    }
});
