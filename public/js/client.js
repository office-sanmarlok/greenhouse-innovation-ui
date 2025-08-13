// Greenhouse of Innovation - Client-side JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeAnimations();
    initializeTooltips();
    simulateGrowthUpdates();
});

function initializeEventListeners() {
    // Garden bed navigation
    const beds = document.querySelectorAll('.bed');
    beds.forEach(bed => {
        bed.addEventListener('click', () => {
            const week = bed.dataset.week;
            window.location.href = `/?week=${week}`;
        });
    });
    
    // Vote buttons
    const voteButtons = document.querySelectorAll('.vote-btn');
    voteButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const projectId = btn.dataset.projectId;
            await voteForProject(projectId);
        });
    });
    
    // Plant seed button
    const plantSeedBtn = document.getElementById('plantSeedBtn');
    const addFirstSeed = document.getElementById('addFirstSeed');
    const plantModal = document.getElementById('plantModal');
    
    [plantSeedBtn, addFirstSeed].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                plantModal.style.display = 'block';
                setTimeout(() => {
                    plantModal.classList.add('active');
                }, 10);
            });
        }
    });
    
    // Modal controls
    const cancelBtn = document.querySelector('.cancel-btn');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    
    [cancelBtn, modalBackdrop].forEach(element => {
        if (element) {
            element.addEventListener('click', () => {
                closeModal();
            });
        }
    });
    
    // Plant form submission
    const plantingForm = document.getElementById('plantingForm');
    if (plantingForm) {
        plantingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await submitNewProject(e.target);
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterPlants(e.target.value.toLowerCase());
        });
    }
    
    // Climate controls
    const climateControls = document.querySelectorAll('.climate-dial');
    climateControls.forEach(control => {
        control.addEventListener('click', () => {
            const filter = control.dataset.filter;
            applyFilter(filter);
            
            // Rotate animation
            control.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                control.style.transform = '';
            }, 500);
        });
    });
    
    // Plant card hover effects
    const plantCards = document.querySelectorAll('.potted-plant');
    plantCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const plant = card.querySelector('.plant');
            if (plant) {
                plant.style.animation = 'plantWiggle 0.5s ease-in-out';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const plant = card.querySelector('.plant');
            if (plant) {
                plant.style.animation = '';
            }
        });
    });
    
    // Navigation arrows
    const prevBtn = document.querySelector('.bed-nav.prev');
    const nextBtn = document.querySelector('.bed-nav.next');
    const bedsStrip = document.querySelector('.beds-strip');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            bedsStrip.scrollBy({ left: -210, behavior: 'smooth' });
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            bedsStrip.scrollBy({ left: 210, behavior: 'smooth' });
        });
    }
}

async function voteForProject(projectId) {
    try {
        const response = await fetch(`/api/projects/${projectId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update vote count
            const voteElement = document.getElementById(`votes-${projectId}`);
            if (voteElement) {
                voteElement.textContent = data.data.votes;
                
                // Animate the vote
                voteElement.style.animation = 'votePopup 0.5s ease-out';
                setTimeout(() => {
                    voteElement.style.animation = '';
                }, 500);
            }
            
            // Update growth
            const plantCard = document.querySelector(`[data-id="${projectId}"]`);
            if (plantCard) {
                const vine = plantCard.querySelector('.vitality-vine');
                if (vine) {
                    vine.style.setProperty('--growth', `${data.data.growth}%`);
                    
                    // Add water drop animation
                    addWaterDropAnimation(vine);
                }
            }
            
            showSuccessMessage('Your vote helps this plant grow!');
        }
    } catch (error) {
        console.error('Error voting:', error);
        showErrorMessage('Failed to vote. Please try again.');
    }
}

async function submitNewProject(form) {
    const formData = new FormData(form);
    const projectData = {
        name: formData.get('name'),
        description: formData.get('description'),
        tags: formData.get('tags')
    };
    
    try {
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeModal();
            showSuccessMessage('Your seed has been planted! Watch it grow.');
            
            // Reload after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            showErrorMessage(data.message || 'Failed to plant seed.');
        }
    } catch (error) {
        console.error('Error submitting project:', error);
        showErrorMessage('Failed to plant seed. Please try again.');
    }
}

function closeModal() {
    const plantModal = document.getElementById('plantModal');
    plantModal.classList.remove('active');
    setTimeout(() => {
        plantModal.style.display = 'none';
    }, 300);
}

function filterPlants(searchTerm) {
    const plants = document.querySelectorAll('.potted-plant');
    let visibleCount = 0;
    
    plants.forEach(plant => {
        const name = plant.querySelector('.plant-name').textContent.toLowerCase();
        const description = plant.querySelector('.plant-description').textContent.toLowerCase();
        const tags = Array.from(plant.querySelectorAll('.nutrient-label'))
            .map(tag => tag.textContent.toLowerCase())
            .join(' ');
        
        const searchContent = `${name} ${description} ${tags}`;
        
        if (searchContent.includes(searchTerm)) {
            plant.style.display = 'block';
            visibleCount++;
        } else {
            plant.style.display = 'none';
        }
    });
    
    // Show/hide sections based on results
    const featuredSection = document.querySelector('.featured-garden');
    const regularSection = document.querySelector('.regular-garden');
    
    if (featuredSection) {
        const visibleFeatured = featuredSection.querySelectorAll('.potted-plant:not([style*="display: none"])').length;
        featuredSection.style.display = visibleFeatured > 0 ? 'block' : 'none';
    }
    
    if (regularSection) {
        const visibleRegular = regularSection.querySelectorAll('.potted-plant:not([style*="display: none"])').length;
        regularSection.style.display = visibleRegular > 0 ? 'block' : 'none';
    }
}

function applyFilter(filterType) {
    const plants = document.querySelectorAll('.potted-plant');
    
    switch(filterType) {
        case 'trending':
            plants.forEach(plant => {
                const vine = plant.querySelector('.vitality-vine');
                const growth = parseInt(vine.style.getPropertyValue('--growth'));
                plant.style.display = growth >= 50 ? 'block' : 'none';
            });
            break;
        case 'all':
        default:
            plants.forEach(plant => {
                plant.style.display = 'block';
            });
            break;
    }
}

function initializeAnimations() {
    // Add staggered animation to plants
    const plants = document.querySelectorAll('.potted-plant');
    plants.forEach((plant, index) => {
        plant.style.animationDelay = `${index * 0.1}s`;
    });
}

function initializeTooltips() {
    const vines = document.querySelectorAll('.vitality-vine');
    
    vines.forEach(vine => {
        vine.addEventListener('mouseenter', (e) => {
            const growth = e.target.style.getPropertyValue('--growth');
            showTooltip(e.target, `Growth: ${growth}`);
        });
        
        vine.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    hideTooltip(); // Remove any existing tooltip
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--color-green-deep);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.85rem;
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.2s;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            tooltip.remove();
        }, 200);
    }
}

function addWaterDropAnimation(vine) {
    const waterDrop = document.createElement('div');
    waterDrop.className = 'water-drop';
    waterDrop.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 8px;
        background: var(--color-green-light);
        border-radius: 50% 50% 50% 0;
        transform: rotate(45deg);
        animation: waterDrop 1s ease-out forwards;
        pointer-events: none;
    `;
    
    vine.appendChild(waterDrop);
    
    setTimeout(() => {
        waterDrop.remove();
    }, 1000);
}

function simulateGrowthUpdates() {
    setInterval(() => {
        const vines = document.querySelectorAll('.vitality-vine');
        if (vines.length > 0) {
            const randomVine = vines[Math.floor(Math.random() * vines.length)];
            const currentGrowth = parseInt(randomVine.style.getPropertyValue('--growth'));
            
            if (currentGrowth < 100) {
                const newGrowth = Math.min(100, currentGrowth + Math.random() * 3);
                randomVine.style.setProperty('--growth', `${newGrowth}%`);
                addWaterDropAnimation(randomVine);
            }
        }
    }, 8000);
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove any existing messages
    const existingToast = document.querySelector('.message-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `message-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${type === 'success' ? 'var(--color-green-primary)' : '#FF5252'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 2rem;
        box-shadow: var(--shadow-strong);
        z-index: 3000;
        animation: toastSlideUp 0.3s ease-out forwards;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideDown 0.3s ease-in forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add required animations
const style = document.createElement('style');
style.textContent = `
    @keyframes plantWiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-3deg); }
        75% { transform: rotate(3deg); }
    }
    
    @keyframes votePopup {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    
    @keyframes waterDrop {
        0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) rotate(45deg);
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px) rotate(45deg) scale(0.5);
        }
    }
    
    @keyframes toastSlideUp {
        to {
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes toastSlideDown {
        from {
            transform: translateX(-50%) translateY(0);
        }
        to {
            transform: translateX(-50%) translateY(100px);
        }
    }
    
    .plant-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
    }
    
    .plant-modal .modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .plant-modal .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        max-width: 500px;
        width: 90%;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .plant-modal.active .modal-backdrop {
        opacity: 1;
    }
    
    .plant-modal.active .modal-content {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    
    .planting-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-top: 1.5rem;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .form-group label {
        font-weight: 500;
        color: var(--color-green-deep);
    }
    
    .form-group input,
    .form-group textarea {
        padding: 0.75rem;
        border: 2px solid rgba(76, 175, 80, 0.2);
        border-radius: 0.5rem;
        font-size: 0.95rem;
        transition: var(--transition-smooth);
        font-family: inherit;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--color-green-primary);
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }
    
    .form-group textarea {
        min-height: 100px;
        resize: vertical;
    }
    
    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    .cancel-btn,
    .plant-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition-smooth);
        border: none;
        font-size: 0.95rem;
    }
    
    .cancel-btn {
        background: white;
        border: 2px solid rgba(76, 175, 80, 0.2);
        color: var(--color-green-deep);
    }
    
    .cancel-btn:hover {
        background: rgba(76, 175, 80, 0.05);
    }
    
    .plant-btn {
        background: var(--color-green-primary);
        color: white;
    }
    
    .plant-btn:hover {
        background: var(--color-green-light);
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
    }
`;

document.head.appendChild(style);