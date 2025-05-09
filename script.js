document.addEventListener('DOMContentLoaded', function() {
    // Loader
    setTimeout(() => {
        document.querySelector('.loader').classList.add('fade-out');
        setTimeout(() => {
            document.querySelector('.loader').style.display = 'none';
        }, 500);
    }, 2000);

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Animate skills on scroll
    const skillItems = document.querySelectorAll('.skill-item');
    
    const animateSkills = () => {
        skillItems.forEach(item => {
            const progress = item.querySelector('.skill-progress');
            const value = progress.getAttribute('data-value');
            
            if (isElementInViewport(progress)) {
                progress.style.width = value + '%';
            }
        });
    };
    
    window.addEventListener('scroll', animateSkills);
    animateSkills(); // Run once on load

    // Work filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            workItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Auto-play videos on hover
    workItems.forEach(item => {
        const video = item.querySelector('video');
        if (video) {
            item.addEventListener('mouseenter', () => {
                video.play().catch(e => console.log('Video play failed:', e));
            });
            
            item.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });

    // Initialize 3D animations
    initCharacterAnimation();
    initContactAnimation();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // 3D Character Animation (R6 Running)
    function initCharacterAnimation() {
        const container = document.getElementById('character-container');
        if (!container) return;
        
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null;
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 3);
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        // Create R6 character
        const character = createR6Character();
        scene.add(character);
        
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xdddddd,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);
        
        // Animation variables
        let runCycle = 0;
        const runSpeed = 0.1;
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Update running animation
            runCycle += runSpeed;
            
            // Head bob
            character.head.position.y = 1.8 + Math.sin(runCycle * 2) * 0.05;
            
            // Arm swing
            character.leftArm.rotation.x = Math.sin(runCycle) * 0.5;
            character.rightArm.rotation.x = Math.sin(runCycle + Math.PI) * 0.5;
            
            // Leg swing
            character.leftLeg.rotation.x = Math.sin(runCycle + Math.PI) * 0.5;
            character.rightLeg.rotation.x = Math.sin(runCycle) * 0.5;
            
            // Body tilt
            character.torso.rotation.z = Math.sin(runCycle) * 0.05;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
    
    function createR6Character() {
        // Create a group to hold all character parts
        const character = new THREE.Group();
        
        // Materials
        const headMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFD700, // Gold color for head
            roughness: 0.3,
            metalness: 0.1
        });
        
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x5dade2, // Blue color for body
            roughness: 0.3,
            metalness: 0.1
        });
        
        const limbMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x5dade2, // Blue color for limbs
            roughness: 0.3,
            metalness: 0.1
        });
        
        // Create parts
        // Head
        const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.8;
        head.castShadow = true;
        character.add(head);
        
        // Torso
        const torsoGeometry = new THREE.BoxGeometry(0.8, 1, 0.4);
        const torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
        torso.position.y = 1.1;
        torso.castShadow = true;
        character.add(torso);
        
        // Arms
        const armGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3);
        
        // Left Arm
        const leftArm = new THREE.Mesh(armGeometry, limbMaterial);
        leftArm.position.set(0.6, 1.1, 0);
        leftArm.castShadow = true;
        character.add(leftArm);
        
        // Right Arm
        const rightArm = new THREE.Mesh(armGeometry, limbMaterial);
        rightArm.position.set(-0.6, 1.1, 0);
        rightArm.castShadow = true;
        character.add(rightArm);
        
        // Legs
        const legGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3);
        
        // Left Leg
        const leftLeg = new THREE.Mesh(legGeometry, limbMaterial);
        leftLeg.position.set(0.25, 0.4, 0);
        leftLeg.castShadow = true;
        character.add(leftLeg);
        
        // Right Leg
        const rightLeg = new THREE.Mesh(legGeometry, limbMaterial);
        rightLeg.position.set(-0.25, 0.4, 0);
        rightLeg.castShadow = true;
        character.add(rightLeg);
        
        // Store references for animation
        character.head = head;
        character.torso = torso;
        character.leftArm = leftArm;
        character.rightArm = rightArm;
        character.leftLeg = leftLeg;
        character.rightLeg = rightLeg;
        
        return character;
    }

    // Contact Section Animation (Floating Roblox Logos)
    function initContactAnimation() {
        const container = document.getElementById('contact-3d');
        if (!container) return;
        
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null;
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Create floating Roblox logos
        const logos = [];
        const logoGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
        const logoMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x5dade2,
            transparent: true,
            opacity: 0.8,
            roughness: 0.2,
            metalness: 0.5
        });
        
        // Create 10 logos
        for (let i = 0; i < 10; i++) {
            const logo = new THREE.Mesh(logoGeometry, logoMaterial);
            
            // Random position
            logo.position.x = (Math.random() - 0.5) * 8;
            logo.position.y = (Math.random() - 0.5) * 4;
            logo.position.z = (Math.random() - 0.5) * 8;
            
            // Random rotation
            logo.rotation.x = Math.random() * Math.PI;
            logo.rotation.y = Math.random() * Math.PI;
            
            // Store animation properties
            logo.userData = {
                speedX: Math.random() * 0.02 - 0.01,
                speedY: Math.random() * 0.02 - 0.01,
                speedZ: Math.random() * 0.02 - 0.01,
                rotX: Math.random() * 0.02 - 0.01,
                rotY: Math.random() * 0.02 - 0.01,
                rotZ: Math.random() * 0.02 - 0.01
            };
            
            scene.add(logo);
            logos.push(logo);
        }
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Update logo positions and rotations
            logos.forEach(logo => {
                logo.position.x += logo.userData.speedX;
                logo.position.y += logo.userData.speedY;
                logo.position.z += logo.userData.speedZ;
                
                logo.rotation.x += logo.userData.rotX;
                logo.rotation.y += logo.userData.rotY;
                logo.rotation.z += logo.userData.rotZ;
                
                // Bounce off imaginary walls
                if (Math.abs(logo.position.x) > 4) logo.userData.speedX *= -1;
                if (Math.abs(logo.position.y) > 2.5) logo.userData.speedY *= -1;
                if (Math.abs(logo.position.z) > 4) logo.userData.speedZ *= -1;
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
});

// Improved R6 Character Creation
function createR6Character() {
    const character = new THREE.Group();
    
    // Materials - all blue now
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x5dade2,
        roughness: 0.3,
        metalness: 0.1
    });
    
    // Create parts
    // Head (now same color as body)
    const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.y = 1.8;
    head.castShadow = true;
    character.add(head);
    
    // Torso
    const torsoGeometry = new THREE.BoxGeometry(0.8, 1, 0.4);
    const torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
    torso.position.y = 1.1;
    torso.castShadow = true;
    character.add(torso);
    
    // Arms with better proportions
    const armGeometry = new THREE.BoxGeometry(0.25, 0.9, 0.25);
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(0.55, 1.1, 0);
    character.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(-0.55, 1.1, 0);
    character.add(rightArm);
    
    // Legs with better proportions
    const legGeometry = new THREE.BoxGeometry(0.3, 0.9, 0.3);
    const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    leftLeg.position.set(0.2, 0.35, 0);
    character.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    rightLeg.position.set(-0.2, 0.35, 0);
    character.add(rightLeg);
    
    // Improved running animation
    let runCycle = 0;
    const animateCharacter = () => {
        runCycle += 0.1;
        
        // Smoother head bob
        head.position.y = 1.8 + Math.sin(runCycle * 2) * 0.03;
        
        // More natural arm swing
        leftArm.rotation.x = Math.sin(runCycle) * 0.8;
        rightArm.rotation.x = Math.sin(runCycle + Math.PI) * 0.8;
        
        // Better leg movement
        leftLeg.rotation.x = Math.sin(runCycle + Math.PI) * 0.6;
        rightLeg.rotation.x = Math.sin(runCycle) * 0.6;
        
        // Subtle body tilt
        torso.rotation.z = Math.sin(runCycle) * 0.03;
        
        // Slight up/down movement
        character.position.y = Math.sin(runCycle) * 0.05;
    };
    
    // Store references
    character.head = head;
    character.torso = torso;
    character.leftArm = leftArm;
    character.rightArm = rightArm;
    character.leftLeg = leftLeg;
    character.rightLeg = rightLeg;
    character.animate = animateCharacter;
    
    return character;
}

// In the animation loop:
function animate() {
    requestAnimationFrame(animate);
    
    if (character.animate) character.animate();
    
    renderer.render(scene, camera);
}

