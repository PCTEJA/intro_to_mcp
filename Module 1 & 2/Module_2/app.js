// MCP Learning Platform - Module 2: Core Concepts
// Advanced 3D Interactive JavaScript with Animations

class MCPModule2Platform {
    constructor() {
        this.currentSection = 'hero';
        this.isScrolling = false;
        this.animatedElements = new Set();
        this.flowPlaying = false;
        this.currentFlowStep = 0;
        this.quizData = this.initQuizData();
        this.currentQuiz = 0;
        this.quizAnswers = [];
        
        this.init();
        this.setupEventListeners();
        this.startAnimations();
    }

    init() {
        this.initScrollSpy();
        this.initArchitectureVisualization();
        this.initPrimitiveCards();
        this.initCommunicationFlow();
        this.initLayerVisualization();
        this.initQuiz();
        this.initParticleSystem();
        this.init3DEffects();
        this.initScrollReveal();
    }

    setupEventListeners() {
        // Smooth scrolling for navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
            });
        });

        // CTA button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection('#architecture');
            });
        }

        // FAB scroll to top
        const fab = document.querySelector('.fab');
        if (fab) {
            fab.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }

        // Scroll events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Resize events
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));

        // Architecture controls
        this.setupArchitectureControls();
        
        // Communication flow controls
        this.setupFlowControls();

        // Layer visualization
        this.setupLayerControls();
    }

    scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
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

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });

            this.currentSection = currentSectionId;
        };

        window.addEventListener('scroll', this.throttle(updateActiveNav, 100));
        updateActiveNav();
    }

    initArchitectureVisualization() {
        const scene = document.getElementById('architecture-scene');
        if (!scene) return;

        // Add interactive hover effects to nodes
        const nodes = scene.querySelectorAll('.node-3d');
        nodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                this.highlightNode(node);
            });

            node.addEventListener('mouseleave', () => {
                this.resetNodeHighlight(node);
            });

            node.addEventListener('click', () => {
                const nodeType = node.getAttribute('data-info');
                this.showNodeDetails(nodeType);
            });
        });

        // Animate data packets
        this.startDataPacketAnimation();
    }

    highlightNode(node) {
        node.style.transform = 'rotateX(15deg) rotateY(15deg) translateY(-15px) scale(1.05)';
        node.style.boxShadow = '0 25px 60px rgba(0,0,0,0.2), 0 0 0 3px var(--color-primary)';
        
        // Add glow effect
        const nodeCore = node.querySelector('.node-core');
        if (nodeCore) {
            nodeCore.style.background = 'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.2), transparent)';
        }
    }

    resetNodeHighlight(node) {
        node.style.transform = '';
        node.style.boxShadow = '';
        
        const nodeCore = node.querySelector('.node-core');
        if (nodeCore) {
            nodeCore.style.background = '';
        }
    }

    showNodeDetails(nodeType) {
        // Hide all detail cards
        document.querySelectorAll('.detail-card').forEach(card => {
            card.classList.remove('active');
        });

        // Show the relevant detail card
        const detailCard = document.querySelector(`.${nodeType}-details`);
        if (detailCard) {
            detailCard.classList.add('active');
            
            // Animate card appearance
            detailCard.style.transform = 'scale(0.95) translateY(20px)';
            detailCard.style.opacity = '0';
            
            requestAnimationFrame(() => {
                detailCard.style.transition = 'all 0.3s ease';
                detailCard.style.transform = 'scale(1) translateY(0)';
                detailCard.style.opacity = '1';
            });
        }
    }

    startDataPacketAnimation() {
        const packets = document.querySelectorAll('.data-packet');
        packets.forEach((packet, index) => {
            const animationDelay = index * 1000; // 1 second between packets
            packet.style.animationDelay = `${animationDelay}ms`;
            
            // Add random color variation
            const colors = ['var(--color-primary)', 'var(--color-teal-300)', 'var(--color-success)'];
            packet.style.background = colors[index % colors.length];
        });
    }

    setupArchitectureControls() {
        const controls = document.querySelectorAll('.control-btn');
        controls.forEach(control => {
            control.addEventListener('click', () => {
                const view = control.getAttribute('data-view');
                this.switchArchitectureView(view);
                
                // Update active control
                controls.forEach(c => c.classList.remove('active'));
                control.classList.add('active');
            });
        });
    }

    switchArchitectureView(view) {
        const scene = document.getElementById('architecture-scene');
        const clientNode = scene.querySelector('.client-node');
        const serverNode = scene.querySelector('.server-node');
        const channel = scene.querySelector('.communication-channel');

        // Reset transforms
        [clientNode, serverNode, channel].forEach(element => {
            if (element) {
                element.style.transform = '';
                element.style.opacity = '1';
                element.style.filter = '';
            }
        });

        // Apply view-specific transforms
        switch(view) {
            case 'client':
                if (serverNode) {
                    serverNode.style.opacity = '0.3';
                    serverNode.style.filter = 'blur(2px)';
                }
                if (clientNode) {
                    clientNode.style.transform = 'scale(1.1) translateZ(50px)';
                }
                break;
                
            case 'server':
                if (clientNode) {
                    clientNode.style.opacity = '0.3';
                    clientNode.style.filter = 'blur(2px)';
                }
                if (serverNode) {
                    serverNode.style.transform = 'scale(1.1) translateZ(50px)';
                }
                break;
                
            case 'communication':
                if (clientNode && serverNode) {
                    clientNode.style.opacity = '0.5';
                    serverNode.style.opacity = '0.5';
                }
                if (channel) {
                    channel.style.transform = 'scale(1.2) translateZ(50px)';
                }
                break;
                
            case 'overview':
            default:
                // All elements at normal state
                break;
        }
    }

    initPrimitiveCards() {
        const cards = document.querySelectorAll('.primitive-card');
        cards.forEach(card => {
            // Fix: Add click event listener to each card individually
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.flipPrimitiveCard(card);
            });

            // Add hover effects
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('flipped')) {
                    card.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('flipped')) {
                    card.style.transform = '';
                }
            });
        });
    }

    flipPrimitiveCard(card) {
        card.classList.toggle('flipped');
        
        // Add flip animation
        const wrapper = card.querySelector('.card-3d-wrapper');
        if (wrapper) {
            wrapper.style.transform = card.classList.contains('flipped') ? 
                'rotateY(180deg)' : 'rotateY(0deg)';
        }

        // Update card interaction
        if (card.classList.contains('flipped')) {
            card.style.transform = 'translateY(-5px)';
        } else {
            card.style.transform = '';
        }
    }

    initCommunicationFlow() {
        this.flowSteps = document.querySelectorAll('.flow-step');
        this.messageContainer = document.getElementById('message-container');
        
        // Initialize first step
        this.updateFlowStep(0);
        this.displayMessage(0);
    }

    setupFlowControls() {
        const playButton = document.getElementById('play-flow');
        const resetButton = document.getElementById('reset-flow');
        const slider = document.getElementById('flow-slider');

        if (playButton) {
            playButton.addEventListener('click', () => {
                this.toggleFlowPlayback();
            });
        }

        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetFlow();
            });
        }

        if (slider) {
            slider.addEventListener('input', (e) => {
                const step = parseInt(e.target.value);
                this.updateFlowStep(step);
                this.displayMessage(step);
            });
        }
    }

    toggleFlowPlayback() {
        const playButton = document.getElementById('play-flow');
        
        if (this.flowPlaying) {
            this.flowPlaying = false;
            clearInterval(this.flowInterval);
            playButton.innerHTML = '<span class="play-icon">▶️</span> Play Flow';
        } else {
            this.flowPlaying = true;
            playButton.innerHTML = '<span class="play-icon">⏸️</span> Pause Flow';
            
            this.flowInterval = setInterval(() => {
                this.currentFlowStep++;
                if (this.currentFlowStep >= this.flowSteps.length) {
                    this.currentFlowStep = 0;
                }
                
                this.updateFlowStep(this.currentFlowStep);
                this.displayMessage(this.currentFlowStep);
                
                const slider = document.getElementById('flow-slider');
                if (slider) {
                    slider.value = this.currentFlowStep;
                }
            }, 2000);
        }
    }

    resetFlow() {
        this.flowPlaying = false;
        clearInterval(this.flowInterval);
        this.currentFlowStep = 0;
        
        this.updateFlowStep(0);
        this.displayMessage(0);
        
        const playButton = document.getElementById('play-flow');
        const slider = document.getElementById('flow-slider');
        
        if (playButton) {
            playButton.innerHTML = '<span class="play-icon">▶️</span> Play Flow';
        }
        
        if (slider) {
            slider.value = 0;
        }
    }

    updateFlowStep(stepIndex) {
        this.flowSteps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
                // Add animation
                step.style.transform = 'scale(1.05)';
                step.style.boxShadow = '0 0 30px rgba(var(--color-primary-rgb), 0.3)';
            } else {
                step.classList.remove('active');
                step.style.transform = '';
                step.style.boxShadow = '';
            }
        });
    }

    displayMessage(stepIndex) {
        if (!this.messageContainer) return;

        const messages = [
            {
                type: 'initialize',
                content: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {}
    },
    "clientInfo": {
      "name": "ExampleClient",
      "version": "1.0.0"
    }
  }
}`
            },
            {
                type: 'list',
                content: `{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}

Response:
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "calculator",
        "description": "Perform mathematical calculations",
        "inputSchema": {
          "type": "object",
          "properties": {
            "expression": { "type": "string" }
          }
        }
      }
    ]
  }
}`
            },
            {
                type: 'call',
                content: `{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "calculator",
    "arguments": {
      "expression": "2 + 2"
    }
  }
}`
            },
            {
                type: 'result',
                content: `{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "4"
      }
    ]
  }
}`
            },
            {
                type: 'notification',
                content: `{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "uri": "database://schema"
  }
}`
            }
        ];

        const message = messages[stepIndex];
        if (message) {
            this.messageContainer.innerHTML = `
                <div class="message-type">${message.type.toUpperCase()}</div>
                <pre><code>${message.content}</code></pre>
            `;
        }
    }

    initLayerVisualization() {
        const layers = document.querySelectorAll('.layer');
        layers.forEach(layer => {
            const header = layer.querySelector('.layer-header');
            header.addEventListener('click', () => {
                this.toggleLayer(layer);
            });
        });

        // Initialize with application layer active
        const appLayer = document.querySelector('[data-layer="application"]');
        if (appLayer) {
            this.toggleLayer(appLayer);
        }
    }

    setupLayerControls() {
        // Layer controls are handled by the click events in initLayerVisualization
    }

    toggleLayer(selectedLayer) {
        const layers = document.querySelectorAll('.layer');
        const panels = document.querySelectorAll('.detail-panel');
        
        // Close all layers first
        layers.forEach(layer => {
            layer.classList.remove('active');
        });
        
        panels.forEach(panel => {
            panel.classList.remove('active');
        });

        // Open selected layer
        selectedLayer.classList.add('active');
        
        const layerType = selectedLayer.getAttribute('data-layer');
        const panel = document.querySelector(`.${layerType}-detail`);
        if (panel) {
            setTimeout(() => {
                panel.classList.add('active');
            }, 200);
        }
    }

    initQuizData() {
        return [
            {
                question: "What are the three core primitives in MCP?",
                options: [
                    "Functions, Data, Templates",
                    "Tools, Resources, Prompts",
                    "Client, Server, Protocol",
                    "Input, Output, Process"
                ],
                correct: 1,
                explanation: "MCP defines three core primitives: Tools (functions), Resources (data), and Prompts (templates)."
            },
            {
                question: "Which protocol does MCP use for communication?",
                options: [
                    "HTTP/REST",
                    "GraphQL",
                    "JSON-RPC 2.0",
                    "WebSocket"
                ],
                correct: 2,
                explanation: "MCP uses JSON-RPC 2.0 as its communication protocol, providing standardized request/response patterns."
            },
            {
                question: "What is the primary characteristic of MCP Resources?",
                options: [
                    "They execute functions",
                    "They provide read-only data access",
                    "They store user sessions",
                    "They handle authentication"
                ],
                correct: 1,
                explanation: "Resources provide read-only access to data sources and can support subscriptions for updates."
            },
            {
                question: "Which transport method is NOT supported by MCP?",
                options: [
                    "stdio",
                    "Server-Sent Events",
                    "WebSocket",
                    "FTP"
                ],
                correct: 3,
                explanation: "MCP supports stdio, Server-Sent Events, and WebSocket transports, but not FTP."
            },
            {
                question: "What happens in the 'Initialize Connection' step?",
                options: [
                    "Tools are executed",
                    "Resources are downloaded",
                    "Capabilities are exchanged",
                    "Prompts are generated"
                ],
                correct: 2,
                explanation: "During initialization, the client and server exchange capabilities and establish the communication protocol."
            }
        ];
    }

    initQuiz() {
        this.displayQuestion();
        this.setupQuizControls();
    }

    setupQuizControls() {
        const nextBtn = document.getElementById('next-question');
        const prevBtn = document.getElementById('prev-question');
        const completeBtn = document.getElementById('complete-module');

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleQuizNavigation('next');
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleQuizNavigation('prev');
            });
        }

        if (completeBtn) {
            completeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.completeModule();
            });
        }
    }

    displayQuestion() {
        const questionCard = document.getElementById('question-card');
        const progressFill = document.getElementById('quiz-progress');
        const progressText = document.getElementById('quiz-progress-text');

        if (!questionCard || !this.quizData[this.currentQuiz]) return;

        const question = this.quizData[this.currentQuiz];
        const progress = ((this.currentQuiz + 1) / this.quizData.length) * 100;

        questionCard.innerHTML = `
            <div class="question-content">
                <h3>Question ${this.currentQuiz + 1}</h3>
                <p class="question-text">${question.question}</p>
                <div class="options-container">
                    ${question.options.map((option, index) => `
                        <div class="option" data-index="${index}">
                            <input type="radio" name="quiz-option-${this.currentQuiz}" id="option-${this.currentQuiz}-${index}" value="${index}">
                            <label for="option-${this.currentQuiz}-${index}">${option}</label>
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-feedback" id="quiz-feedback" style="display: none;"></div>
            </div>
        `;

        // Update progress
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Question ${this.currentQuiz + 1} of ${this.quizData.length}`;
        }

        // Add option click handlers
        const options = questionCard.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                this.selectOption(option);
            });
        });

        // Update navigation buttons
        const nextBtn = document.getElementById('next-question');
        const prevBtn = document.getElementById('prev-question');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuiz === 0;
        }
        
        if (nextBtn) {
            nextBtn.textContent = this.currentQuiz === this.quizData.length - 1 ? 'Finish Quiz' : 'Next';
        }

        // Restore previous answer if exists
        if (this.quizAnswers[this.currentQuiz] !== undefined) {
            const savedAnswer = this.quizAnswers[this.currentQuiz];
            const savedOption = questionCard.querySelector(`[data-index="${savedAnswer}"]`);
            if (savedOption) {
                this.selectOption(savedOption);
            }
        }
    }

    selectOption(selectedOption) {
        const questionCard = document.getElementById('question-card');
        const options = questionCard.querySelectorAll('.option');
        const feedback = document.getElementById('quiz-feedback');
        const question = this.quizData[this.currentQuiz];
        const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));

        // Remove previous selections
        options.forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });

        // Mark selected option
        selectedOption.classList.add('selected');
        
        // Store answer
        this.quizAnswers[this.currentQuiz] = selectedIndex;

        // Show immediate feedback
        const isCorrect = selectedIndex === question.correct;
        
        if (isCorrect) {
            selectedOption.classList.add('correct');
            feedback.innerHTML = `
                <div class="feedback correct">
                    <div class="feedback-icon">✅</div>
                    <div class="feedback-text">
                        <strong>Correct!</strong>
                        <p>${question.explanation}</p>
                    </div>
                </div>
            `;
        } else {
            selectedOption.classList.add('incorrect');
            options[question.correct].classList.add('correct');
            feedback.innerHTML = `
                <div class="feedback incorrect">
                    <div class="feedback-icon">❌</div>
                    <div class="feedback-text">
                        <strong>Not quite right.</strong>
                        <p>${question.explanation}</p>
                    </div>
                </div>
            `;
        }

        feedback.style.display = 'block';

        // Add 3D feedback animation
        selectedOption.style.transform = isCorrect ? 
            'scale(1.05) translateY(-5px)' : 
            'scale(0.95) translateY(5px)';
        
        setTimeout(() => {
            selectedOption.style.transform = '';
        }, 300);
    }

    handleQuizNavigation(direction) {
        // Fix: Ensure quiz navigation works correctly
        if (direction === 'next') {
            if (this.currentQuiz < this.quizData.length - 1) {
                this.currentQuiz++;
                this.displayQuestion();
            } else {
                // Quiz complete
                this.showQuizResults();
            }
        } else if (direction === 'prev') {
            if (this.currentQuiz > 0) {
                this.currentQuiz--;
                this.displayQuestion();
            }
        }
    }

    showQuizResults() {
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('quiz-results');
        const resultsTitle = document.getElementById('results-title');
        const resultsScore = document.getElementById('results-score');
        const resultsBreakdown = document.getElementById('results-breakdown');

        // Calculate score
        let correctAnswers = 0;
        this.quizAnswers.forEach((answer, index) => {
            if (answer === this.quizData[index].correct) {
                correctAnswers++;
            }
        });

        const percentage = Math.round((correctAnswers / this.quizData.length) * 100);
        
        // Hide quiz container and show results
        quizContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

        // Update results content
        if (resultsTitle) {
            resultsTitle.textContent = percentage >= 80 ? 
                'Excellent Work! 🎉' : 
                percentage >= 60 ? 
                'Good Job! 👍' : 
                'Keep Learning! 📚';
        }

        if (resultsScore) {
            resultsScore.textContent = `You scored ${correctAnswers}/${this.quizData.length} (${percentage}%)`;
        }

        if (resultsBreakdown) {
            resultsBreakdown.innerHTML = `
                <div class="score-breakdown">
                    <div class="score-circle">
                        <div class="score-text">${percentage}%</div>
                    </div>
                    <div class="score-details">
                        <div class="detail-item">
                            <span class="detail-label">Correct Answers:</span>
                            <span class="detail-value">${correctAnswers}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Total Questions:</span>
                            <span class="detail-value">${this.quizData.length}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Completion Time:</span>
                            <span class="detail-value">Module 2 Complete</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    completeModule() {
        this.showCompletionModal();
    }

    showCompletionModal() {
        const modal = document.createElement('div');
        modal.className = 'completion-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="completion-animation">
                    <div class="success-icon">🏆</div>
                    <h3>Module 2 Complete!</h3>
                    <p>Congratulations! You've mastered the core concepts of MCP architecture.</p>
                    <div class="achievement-badges">
                        <div class="badge">🏗️ Architecture Expert</div>
                        <div class="badge">🔧 Primitives Master</div>
                        <div class="badge">📡 Protocol Specialist</div>
                    </div>
                    <div class="modal-actions">
                        <button class="quiz-btn primary" id="continue-learning">
                            Continue to Module 3
                        </button>
                        <button class="quiz-btn" id="review-module">
                            Review Module
                        </button>
                    </div>
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
                backdrop-filter: blur(10px);
            }
            
            .modal-content {
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                padding: var(--space-32);
                text-align: center;
                max-width: 500px;
                margin: var(--space-24);
                border: 1px solid var(--color-card-border);
                position: relative;
                z-index: 2;
                transform: scale(0.8) translateY(50px);
                transition: all 0.4s ease;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            
            .completion-modal.show {
                opacity: 1;
            }
            
            .completion-modal.show .modal-content {
                transform: scale(1) translateY(0);
            }
            
            .completion-animation .success-icon {
                font-size: 4rem;
                margin-bottom: var(--space-16);
                animation: pulseGlow3D 2s infinite;
            }
            
            .achievement-badges {
                display: flex;
                flex-wrap: wrap;
                gap: var(--space-8);
                justify-content: center;
                margin: var(--space-24) 0;
            }
            
            .badge {
                background: var(--color-bg-1);
                color: var(--color-primary);
                padding: var(--space-8) var(--space-16);
                border-radius: var(--radius-full);
                font-size: var(--font-size-sm);
                font-weight: var(--font-weight-medium);
                border: 1px solid rgba(var(--color-primary-rgb), 0.2);
            }
            
            .modal-actions {
                display: flex;
                gap: var(--space-12);
                justify-content: center;
                margin-top: var(--space-24);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);

        // Set up event handlers
        const continueBtn = modal.querySelector('#continue-learning');
        const reviewBtn = modal.querySelector('#review-module');
        const overlay = modal.querySelector('.modal-overlay');

        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }, 300);
        };

        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                closeModal();
                // Could navigate to Module 3 here
            });
        }

        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                closeModal();
                this.scrollToSection('#hero');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    initParticleSystem() {
        const particleField = document.querySelector('.particle-field');
        if (!particleField) return;

        // Create floating particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--color-primary);
                border-radius: 50%;
                opacity: 0.3;
                animation: particleFloat ${10 + Math.random() * 20}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
            `;
            particleField.appendChild(particle);
        }

        // Add particle animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% { 
                    transform: translateY(0px) rotate(0deg); 
                    opacity: 0;
                }
                10% { 
                    opacity: 0.3;
                }
                90% { 
                    opacity: 0.3;
                }
                100% { 
                    transform: translateY(-100vh) rotate(360deg); 
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    init3DEffects() {
        // Enhanced 3D hover effects for cards
        const cards = document.querySelectorAll('.stat-item, .detail-card, .spec-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Geometric shapes morphing
        const shapes = document.querySelectorAll('.geometric-shape');
        shapes.forEach(shape => {
            shape.style.animation += ', morphGeometry 15s infinite ease-in-out';
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
                    
                    // Add staggered animation for grid items
                    if (entry.target.matches('.primitive-card, .spec-card, .flow-step')) {
                        const siblings = Array.from(entry.target.parentElement.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll(
            '.primitive-card, .spec-card, .flow-step, .layer, .section-header'
        );

        revealElements.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            revealObserver.observe(element);
        });
    }

    startAnimations() {
        // Start hero animation sequence
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-stats, .cta-button');
            heroElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 500);

        // Animate geometric shapes
        setTimeout(() => {
            const shapes = document.querySelectorAll('.geometric-shape');
            shapes.forEach(shape => {
                shape.style.opacity = '0.8';
            });
        }, 1000);
    }

    handleScroll() {
        if (this.isScrolling) return;
        this.isScrolling = true;

        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const nav = document.querySelector('.main-nav');
            const fab = document.querySelector('.fab');

            // Update navigation background
            if (scrollY > 100) {
                nav.style.background = 'rgba(19, 52, 59, 0.98)';
                nav.style.backdropFilter = 'blur(20px)';
            } else {
                nav.style.background = 'rgba(19, 52, 59, 0.95)';
                nav.style.backdropFilter = 'blur(10px)';
            }

            // Show/hide FAB
            if (scrollY > 500) {
                fab.classList.add('visible');
            } else {
                fab.classList.remove('visible');
            }

            // Parallax effect for geometric shapes
            const shapes = document.querySelectorAll('.geometric-shape');
            shapes.forEach((shape, index) => {
                const speed = 0.2 + (index * 0.1);
                const yPos = scrollY * speed;
                shape.style.transform = `translateY(${yPos}px) ${shape.style.transform.replace(/translateY\([^)]*\)/, '')}`;
            });

            this.isScrolling = false;
        });
    }

    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Handle responsive layout changes
            this.updateResponsiveElements();
        }, 300);
    }

    updateResponsiveElements() {
        // Update architecture visualization for mobile
        const scene = document.getElementById('architecture-scene');
        if (scene && window.innerWidth < 768) {
            scene.style.gridTemplateColumns = '1fr';
            scene.style.gap = 'var(--space-16)';
        } else if (scene) {
            scene.style.gridTemplateColumns = '1fr auto 1fr';
            scene.style.gap = 'var(--space-32)';
        }
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
}

// Global functions for button events
window.scrollToSection = function(targetId) {
    if (window.mcpModule2) {
        window.mcpModule2.scrollToSection(targetId);
    }
};

window.scrollToTop = function() {
    if (window.mcpModule2) {
        window.mcpModule2.scrollToTop();
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing MCP Learning Platform Module 2...');
    
    window.mcpModule2 = new MCPModule2Platform();
    
    setTimeout(() => {
        document.body.classList.add('loaded');
        console.log('MCP Module 2 initialized successfully! 🚀');
    }, 1000);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('MCP Module 2 Error:', e.error);
    
    // Graceful degradation
    if (!window.mcpModule2) {
        console.log('Falling back to basic functionality...');
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
});

// Performance monitoring
if (typeof performance !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Module 2 loaded in ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        }, 1000);
    });
}