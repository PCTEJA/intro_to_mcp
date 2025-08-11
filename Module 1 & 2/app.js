// MCP Learning Platform - Module 1: The Big Picture
// Interactive JavaScript for 3D visualizations and animations

class MCPLearningPlatform {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.startAnimations();
    }

    init() {
        this.currentSection = 'hero';
        this.isScrolling = false;
        this.animatedElements = new Set();
        this.connectionLines = [];
        
        // Initialize components
        this.initScrollSpy();
        this.initCounters();
        this.initConnectionVisualization();
        this.init3DEffects();
        this.initScrollReveal();
    }

    setupEventListeners() {
        // Smooth scrolling for navigation - Fixed
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
            });
        });

        // CTA button - Fixed
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection('#challenges');
            });
        }

        // Next module button - Fixed
        const nextModuleBtn = document.querySelector('.next-module-btn');
        if (nextModuleBtn) {
            nextModuleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCompletionMessage();
            });
        }

        // FAB scroll to top - Fixed
        const fab = document.querySelector('.fab');
        if (fab) {
            fab.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection('#hero');
            });
        }

        // Scroll events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Resize events
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));

        // Use case card interactions
        this.initUseCaseCards();

        // 3D card hover effects - Enhanced
        this.init3DCardEffects();
    }

    scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === targetId) {
                    link.classList.add('active');
                }
            });
        }
    }

    initScrollSpy() {
        const sections = document.querySelectorAll('.section, .hero-section');
        const navLinks = document.querySelectorAll('.nav-link');

        const updateActiveNav = () => {
            let currentSectionId = '';
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) {
                    currentSectionId = section.id;
                }
            });

            // Update navigation
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });

            this.currentSection = currentSectionId;
        };

        window.addEventListener('scroll', this.throttle(updateActiveNav, 100));
        // Initial call
        updateActiveNav();
    }

    initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const targetValue = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutCubic);
            
            // Format large numbers
            if (targetValue >= 1000000) {
                element.textContent = (currentValue / 1000000).toFixed(1) + 'M+';
            } else if (targetValue >= 1000) {
                element.textContent = (currentValue / 1000).toFixed(0) + 'K+';
            } else {
                element.textContent = currentValue.toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    initConnectionVisualization() {
        // Delay to ensure DOM is ready
        setTimeout(() => {
            this.createChaosConnections();
            this.setupMCPVisualization();
            
            // Animate connections on scroll
            const chaosViz = document.querySelector('.before-mcp-viz');
            const solutionViz = document.querySelector('.after-mcp-viz');

            if (chaosViz || solutionViz) {
                const observerOptions = {
                    threshold: 0.3,
                    rootMargin: '0px'
                };

                const vizObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (entry.target.classList.contains('before-mcp-viz')) {
                                this.animateChaosConnections();
                            } else if (entry.target.classList.contains('after-mcp-viz')) {
                                this.animateMCPConnections();
                            }
                        }
                    });
                }, observerOptions);

                if (chaosViz) vizObserver.observe(chaosViz);
                if (solutionViz) vizObserver.observe(solutionViz);
            }
        }, 500);
    }

    createChaosConnections() {
        const container = document.querySelector('.connection-chaos');
        if (!container) return;

        // Remove existing SVG if any
        const existingSvg = container.querySelector('svg');
        if (existingSvg) {
            existingSvg.remove();
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '1';

        const apps = container.querySelectorAll('.app-node');
        const tools = container.querySelectorAll('.tool-node');

        // Create chaotic connections (M×N problem)
        apps.forEach((app, appIndex) => {
            tools.forEach((tool, toolIndex) => {
                const line = this.createConnectionLine(app, tool, container, 'chaos');
                if (line) {
                    svg.appendChild(line);
                    this.connectionLines.push(line);
                }
            });
        });

        container.appendChild(svg);
    }

    createConnectionLine(startElement, endElement, container, type = 'chaos') {
        if (!startElement || !endElement || !container) return null;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        const containerRect = container.getBoundingClientRect();
        const startRect = startElement.getBoundingClientRect();
        const endRect = endElement.getBoundingClientRect();

        const startX = startRect.left + startRect.width / 2 - containerRect.left;
        const startY = startRect.top + startRect.height / 2 - containerRect.top;
        const endX = endRect.left + endRect.width / 2 - containerRect.left;
        const endY = endRect.top + endRect.height / 2 - containerRect.top;

        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        
        if (type === 'chaos') {
            line.setAttribute('stroke', '#ff5459');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('opacity', '0.3');
        } else {
            line.setAttribute('stroke', '#32b8cd');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('opacity', '0.6');
        }

        line.style.strokeDasharray = '5,5';
        line.style.animation = 'connectionPulse 2s infinite';

        return line;
    }

    animateChaosConnections() {
        const chaosContainer = document.querySelector('.connection-chaos svg');
        if (chaosContainer) {
            const lines = chaosContainer.querySelectorAll('line');
            lines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.opacity = '0.6';
                    line.style.strokeWidth = '2';
                }, index * 50);
            });
        }
    }

    setupMCPVisualization() {
        const mcpHub = document.querySelector('.mcp-hub');
        if (!mcpHub) return;

        // Remove existing SVG if any
        const existingSvg = mcpHub.querySelector('svg');
        if (existingSvg) {
            existingSvg.remove();
        }

        // Add connection lines from apps to MCP core and from MCP core to tools
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '1';

        const apps = mcpHub.querySelectorAll('.app-node-new');
        const tools = mcpHub.querySelectorAll('.tool-node-new');
        const core = mcpHub.querySelector('.mcp-core');

        // Connect apps to MCP core
        apps.forEach(app => {
            const line = this.createConnectionLine(app, core, mcpHub, 'mcp');
            if (line) svg.appendChild(line);
        });

        // Connect MCP core to tools
        tools.forEach(tool => {
            const line = this.createConnectionLine(core, tool, mcpHub, 'mcp');
            if (line) svg.appendChild(line);
        });

        mcpHub.appendChild(svg);
    }

    animateMCPConnections() {
        const mcpContainer = document.querySelector('.mcp-hub svg');
        if (mcpContainer) {
            const lines = mcpContainer.querySelectorAll('line');
            lines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.opacity = '0.8';
                    line.style.strokeWidth = '3';
                }, index * 100);
            });
        }
    }

    init3DEffects() {
        // Floating cubes in hero section
        const cubes = document.querySelectorAll('.floating-cube');
        cubes.forEach((cube, index) => {
            cube.style.animationDelay = `${index * 2}s`;
            
            // Add mouse interaction
            cube.addEventListener('mouseenter', () => {
                cube.style.animationPlayState = 'paused';
                cube.style.transform = 'scale(1.3) rotateX(45deg) rotateY(45deg)';
                cube.style.boxShadow = '0 20px 40px rgba(50, 184, 198, 0.4)';
            });
            
            cube.addEventListener('mouseleave', () => {
                cube.style.animationPlayState = 'running';
                cube.style.transform = '';
                cube.style.boxShadow = '';
            });
        });
    }

    init3DCardEffects() {
        const cards = document.querySelectorAll('.challenge-card, .benefit-card, .use-case-card, .concept-card');
        
        cards.forEach(card => {
            let isHovering = false;
            
            card.addEventListener('mouseenter', (e) => {
                isHovering = true;
                card.style.transform = 'translateY(-12px) rotateX(8deg) scale(1.02)';
                card.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
                card.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', (e) => {
                isHovering = false;
                card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
                card.style.boxShadow = '';
                card.style.transition = 'all 0.3s ease';
            });

            card.addEventListener('mousemove', (e) => {
                if (!isHovering) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                
                card.style.transform = `translateY(-12px) rotateX(${8 + rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
        });
    }

    initUseCaseCards() {
        const useCaseCards = document.querySelectorAll('.use-case-card');
        
        useCaseCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all cards
                useCaseCards.forEach(c => c.classList.remove('active'));
                // Add active class to clicked card
                card.classList.add('active');
                
                // Add visual feedback with enhanced animation
                card.style.transform = 'scale(1.05) translateY(-5px)';
                card.style.transition = 'all 0.2s ease';
                
                setTimeout(() => {
                    if (card.classList.contains('active')) {
                        card.style.transform = 'translateY(-4px)';
                    } else {
                        card.style.transform = '';
                    }
                }, 200);
            });
        });
    }

    initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    entry.target.classList.add('animated');
                    this.animatedElements.add(entry.target);
                }
            });
        }, observerOptions);

        // Add reveal animation to elements
        const revealElements = document.querySelectorAll(
            '.challenge-card, .benefit-card, .use-case-card, .concept-card, .section-header'
        );

        revealElements.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            element.style.animationDelay = `${index * 0.1}s`;
            revealObserver.observe(element);
        });
    }

    startAnimations() {
        // Start hero stats animation after page load
        setTimeout(() => {
            const heroStats = document.querySelector('.hero-stats');
            if (heroStats) {
                heroStats.style.opacity = '1';
                heroStats.style.transform = 'translateY(0)';
            }
        }, 1000);

        // Animate protocol rings
        setTimeout(() => {
            const protocolRings = document.querySelectorAll('.protocol-ring');
            protocolRings.forEach(ring => {
                ring.style.animation = 'rotateIn 3s ease-out infinite';
            });
        }, 2000);
    }

    handleScroll() {
        if (this.isScrolling) return;
        this.isScrolling = true;

        requestAnimationFrame(() => {
            // Update navigation background opacity based on scroll
            const nav = document.querySelector('.main-nav');
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                nav.style.background = 'rgba(31, 33, 33, 0.95)';
                nav.style.backdropFilter = 'blur(20px)';
            } else {
                nav.style.background = 'rgba(31, 33, 33, 0.7)';
                nav.style.backdropFilter = 'blur(10px)';
            }

            // Show/hide FAB based on scroll position
            const fab = document.querySelector('.fab');
            if (fab) {
                if (scrollY > 500) {
                    fab.style.opacity = '1';
                    fab.style.transform = 'scale(1)';
                    fab.style.pointerEvents = 'auto';
                } else {
                    fab.style.opacity = '0';
                    fab.style.transform = 'scale(0.8)';
                    fab.style.pointerEvents = 'none';
                }
            }

            // Parallax effect for floating cubes
            const cubes = document.querySelectorAll('.floating-cube');
            cubes.forEach((cube, index) => {
                const speed = 0.3 + (index * 0.1);
                const yPos = scrollY * speed;
                cube.style.transform += ` translateY(${yPos}px)`;
            });

            this.isScrolling = false;
        });
    }

    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Recreate connection visualizations
            this.createChaosConnections();
            this.setupMCPVisualization();
        }, 300);
    }

    showCompletionMessage() {
        // Create a modal for completion
        const completionModal = document.createElement('div');
        completionModal.className = 'completion-modal';
        completionModal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="completion-icon">🎉</div>
                <h3>Congratulations!</h3>
                <p>You've completed Module 1: The Big Picture</p>
                <p>You now understand why MCP was created and how it revolutionizes AI tool integration.</p>
                <div class="modal-actions">
                    <button class="btn btn--primary close-modal">
                        Continue Learning
                    </button>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .completion-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                padding: var(--space-32);
                text-align: center;
                max-width: 450px;
                margin: var(--space-24);
                border: 1px solid var(--color-card-border);
                position: relative;
                z-index: 2;
                transform: scale(0.8) translateY(50px);
                transition: all 0.3s ease;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .completion-modal.show {
                opacity: 1;
            }
            .completion-modal.show .modal-content {
                transform: scale(1) translateY(0);
            }
            .completion-icon {
                font-size: 4rem;
                margin-bottom: var(--space-16);
            }
            .modal-content h3 {
                color: var(--color-text);
                margin-bottom: var(--space-16);
            }
            .modal-content p {
                color: var(--color-text-secondary);
                margin-bottom: var(--space-16);
                line-height: 1.6;
            }
            .close-modal:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(var(--color-primary-rgb), 0.4);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(completionModal);
        
        // Animate in
        setTimeout(() => {
            completionModal.classList.add('show');
        }, 100);
        
        // Close modal functionality
        const closeModal = () => {
            completionModal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(completionModal);
                document.head.removeChild(style);
            }, 300);
        };
        
        completionModal.querySelector('.close-modal').addEventListener('click', closeModal);
        completionModal.querySelector('.modal-overlay').addEventListener('click', closeModal);
        
        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// Global scroll function for buttons
window.scrollToSection = function(targetId) {
    if (window.mcpPlatform) {
        window.mcpPlatform.scrollToSection(targetId);
    } else {
        // Fallback
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// Additional interactive features
class InteractiveFeatures {
    constructor() {
        this.initKeyboardNavigation();
        this.initAccessibilityFeatures();
        this.initPerformanceOptimizations();
    }

    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && e.ctrlKey) {
                e.preventDefault();
                this.navigateToNextSection();
            } else if (e.key === 'ArrowUp' && e.ctrlKey) {
                e.preventDefault();
                this.navigateToPreviousSection();
            } else if (e.key === 'Home' && e.ctrlKey) {
                e.preventDefault();
                window.scrollToSection('#hero');
            }
        });
    }

    navigateToNextSection() {
        const sections = ['hero', 'challenges', 'solution', 'use-cases', 'architecture'];
        const currentIndex = sections.indexOf(window.mcpPlatform?.currentSection || 'hero');
        const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
        window.scrollToSection(`#${sections[nextIndex]}`);
    }

    navigateToPreviousSection() {
        const sections = ['hero', 'challenges', 'solution', 'use-cases', 'architecture'];
        const currentIndex = sections.indexOf(window.mcpPlatform?.currentSection || 'hero');
        const prevIndex = Math.max(currentIndex - 1, 0);
        window.scrollToSection(`#${sections[prevIndex]}`);
    }

    initAccessibilityFeatures() {
        // Add focus indicators for keyboard navigation
        const focusableElements = document.querySelectorAll(
            'button, a, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--color-primary)';
                element.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });

        // Add aria labels for better screen reader support
        this.addAriaLabels();
    }

    addAriaLabels() {
        // Add aria labels to interactive elements
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((stat, index) => {
            const label = stat.nextElementSibling?.textContent || 'Statistic';
            stat.setAttribute('aria-label', `${stat.textContent} ${label}`);
        });

        // Add role and aria-label to visualization containers
        const vizContainers = document.querySelectorAll('.connection-chaos, .mcp-hub');
        vizContainers.forEach(container => {
            container.setAttribute('role', 'img');
            container.setAttribute('aria-label', 'MCP architecture visualization');
        });
    }

    initPerformanceOptimizations() {
        // Intersection observer for performance
        const observerOptions = {
            rootMargin: '100px'
        };

        const performanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, observerOptions);

        // Observe heavy animation elements
        document.querySelectorAll('.floating-cube, .connection-chaos, .mcp-hub').forEach(element => {
            performanceObserver.observe(element);
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing MCP Learning Platform...');
    
    // Initialize main platform
    window.mcpPlatform = new MCPLearningPlatform();
    
    // Initialize additional features
    window.interactiveFeatures = new InteractiveFeatures();
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
        console.log('MCP Learning Platform Module 1 initialized successfully! 🚀');
        console.log('Use Ctrl+↑/↓ to navigate between sections, Ctrl+Home to go to top');
    }, 1000);
});

// Error handling with graceful degradation
window.addEventListener('error', (e) => {
    console.error('MCP Learning Platform Error:', e.error);
    
    // Graceful degradation - ensure basic functionality works
    if (!window.mcpPlatform) {
        console.log('Falling back to basic navigation...');
        // Fallback basic navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Fallback FAB
        const fab = document.querySelector('.fab');
        if (fab) {
            fab.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }
});

// Performance monitoring
if (typeof performance !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Page loaded in ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        }, 1000);
    });
}