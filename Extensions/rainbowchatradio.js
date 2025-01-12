(function() {
    // Check if the Team Chat Radio already exists to prevent duplication
    if (document.getElementById('team-chat-radio')) {
        console.warn('Team Chat Radio is already initialized.');
        return;
    }

    // Add the gaming font to the document
    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        @keyframes borderAnimation {
            0% {
                border-image: linear-gradient(
                    45deg,
                    #ff0000 0%,
                    #ff7f00 10%,
                    #ffff00 20%,
                    #00ff00 30%,
                    #0000ff 40%,
                    #4b0082 50%,
                    #8b00ff 60%,
                    #ff0000 70%,
                    #ff7f00 80%,
                    #ffff00 90%,
                    #00ff00 100%
                ) 1;
            }
            100% {
                border-image: linear-gradient(
                    45deg,
                    #00ff00 0%,
                    #ff0000 10%,
                    #ff7f00 20%,
                    #ffff00 30%,
                    #00ff00 40%,
                    #0000ff 50%,
                    #4b0082 60%,
                    #8b00ff 70%,
                    #ff0000 80%,
                    #ff7f00 90%,
                    #ffff00 100%
                ) 1;
            }
        }
    `;
    document.head.appendChild(fontStyle);

    // Default messages for all 10 lines, numbered for reference
    const defaultMessages = [
        '#cap',
        '#recap',
        '#dropnow',
        '#auto',
        '#assist Me',
        '#drop',
        '#defend',
        '#status',
        '#yes',
        '#storm',
    ];

    // Load saved messages from localStorage or use defaults
    const savedMessages = JSON.parse(localStorage.getItem('teamChatRadioMessages')) || defaultMessages.slice();

    // Function to save messages to localStorage
    function saveMessages() {
        localStorage.setItem('teamChatRadioMessages', JSON.stringify(savedMessages));
    }

    // Create edit window
    const editWindow = document.createElement('div');
    editWindow.style.display = 'none';
    editWindow.style.position = 'fixed';
    editWindow.style.padding = '10px';
    editWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    editWindow.style.backdropFilter = 'blur(5px)';
    editWindow.style.webkitBackdropFilter = 'blur(5px)';
    editWindow.style.borderRadius = '8px';
    editWindow.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    editWindow.style.zIndex = '10001';
    editWindow.style.width = '200px';
    editWindow.style.fontFamily = '"Press Start 2P", cursive';
    editWindow.style.fontSize = '10px';
    editWindow.style.border = '2px solid';
    editWindow.style.animation = 'borderAnimation 3s linear infinite';

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.style.width = '100%';
    editInput.style.marginBottom = '10px';
    editInput.style.padding = '5px';
    editInput.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    editInput.style.border = 'none';
    editInput.style.borderRadius = '4px';
    editInput.style.color = '#fff';
    editInput.style.fontFamily = '"Press Start 2P", cursive';
    editInput.style.fontSize = '10px';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.gap = '10px';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.padding = '5px 15px';
    saveButton.style.backgroundColor = '#4CAF50';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '4px';
    saveButton.style.color = '#fff';
    saveButton.style.cursor = 'pointer';
    saveButton.style.fontFamily = '"Press Start 2P", cursive';
    saveButton.style.fontSize = '10px';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '5px 15px';
    cancelButton.style.backgroundColor = '#333';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.color = '#fff';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.fontFamily = '"Press Start 2P", cursive';
    cancelButton.style.fontSize = '10px';

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    editWindow.appendChild(editInput);
    editWindow.appendChild(buttonContainer);
    document.body.appendChild(editWindow);

    let currentEditIndex = -1;

    // Create the pop-up container
    const popup = document.createElement('div');
    popup.id = 'team-chat-radio';
    popup.style.position = 'fixed';
    popup.style.bottom = '140px';
    popup.style.left = '10%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.width = '220px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.backdropFilter = 'blur(5px)';
    popup.style.webkitBackdropFilter = 'blur(5px)';
    popup.style.color = '#fff';
    popup.style.padding = '10px';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    popup.style.display = 'none';
    popup.style.zIndex = '10000';
    popup.style.fontFamily = '"Press Start 2P", cursive';
    popup.style.fontSize = '10px';
    popup.style.textAlign = 'left';
    popup.style.userSelect = 'none';
    popup.style.border = '2px solid';
    popup.style.animation = 'borderAnimation 3s linear infinite';

    // Create the title
    const title = document.createElement('div');
    title.textContent = 'fluggywuggys radio';
    title.style.textAlign = 'center';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '10px';
    popup.appendChild(title);

    function showEditWindow(index, text, rect) {
        currentEditIndex = index;
        editInput.value = text;
        
        // Position the edit window near the clicked item
        editWindow.style.display = 'block';
        editWindow.style.top = `${rect.top - editWindow.offsetHeight - 5}px`;
        editWindow.style.left = `${rect.left}px`;
        
        editInput.focus();
    }

    function hideEditWindow() {
        editWindow.style.display = 'none';
        currentEditIndex = -1;
    }

    // Event listeners for save and cancel buttons
    saveButton.addEventListener('click', () => {
        if (currentEditIndex !== -1) {
            const newText = editInput.value.trim();
            if (newText) {
                savedMessages[currentEditIndex] = newText;
                saveMessages();
                messageLines[currentEditIndex].textContent = `${currentEditIndex + 1}. ${newText}`;
            }
        }
        hideEditWindow();
    });

    cancelButton.addEventListener('click', hideEditWindow);

    // Create the message lines
    const messageLines = [];
    for (let i = 0; i < 10; i++) {
        const line = document.createElement('div');
        line.textContent = `${i + 1}. ${savedMessages[i] || ''}`;
        line.style.padding = '4px 5px';
        line.style.borderRadius = '4px';
        line.style.cursor = 'pointer';
        line.title = 'Double-click to edit';

        // Highlight on hover with semi-transparent background
        line.addEventListener('mouseenter', () => {
            line.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        });
        line.addEventListener('mouseleave', () => {
            line.style.backgroundColor = 'transparent';
        });

        // New double-click handler for edit window
        line.addEventListener('dblclick', (e) => {
            const rect = line.getBoundingClientRect();
            const currentText = savedMessages[i];
            showEditWindow(i, currentText, rect);
            e.stopPropagation();
        });

        popup.appendChild(line);
        messageLines.push(line);
    }

    // Click outside to close edit window
    document.addEventListener('click', (e) => {
        if (!editWindow.contains(e.target) && editWindow.style.display === 'block') {
            hideEditWindow();
        }
    });

    // Prevent edit window from closing when clicking inside it
    editWindow.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Handle all keyboard input in edit input
    editInput.addEventListener('keydown', (e) => {
        // Stop event propagation for ALL keys when edit window is open
        e.stopPropagation();
        
        if (e.key === 'Enter') {
            saveButton.click();
        } else if (e.key === 'Escape') {
            cancelButton.click();
        }
        
        // Let the input handle the key event normally
        return true;
    });

    // Append the pop-up to the body
    document.body.appendChild(popup);

    // Function to toggle the pop-up visibility
    function togglePopup() {
        if (popup.style.display === 'none') {
            popup.style.display = 'block';
            hideEditWindow(); // Hide edit window when showing popup
        } else {
            popup.style.display = 'none';
            hideEditWindow();
        }
    }

    // Function to send a message based on key press
    function sendMessage(index) {
        if (index < 0 || index >= savedMessages.length) return;
        const message = savedMessages[index];
        if (typeof Network !== 'undefined' && typeof Network.sendTeam === 'function') {
            Network.sendTeam(message);
            togglePopup();
        } else {
            console.error('Network.sendTeam is not available.');
        }
    }

    // Key listener for 'z' and number keys
    document.addEventListener('keydown', (e) => {
        const tag = e.target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;

        if (e.key === 'z' || e.key === 'Z') {
            togglePopup();
            e.preventDefault();
        }

        if (popup.style.display === 'block') {
            let key = e.key;
            let index;
            if (key >= '1' && key <= '9') {
                index = parseInt(key) - 1;
            } else if (key === '0') {
                index = 9;
            } else {
                return;
            }
            sendMessage(index);
            e.preventDefault();
        }
    });
})();
