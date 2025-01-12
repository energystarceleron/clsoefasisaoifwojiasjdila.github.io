(function() {
    // Check if injector already exists
    if (document.getElementById('fluggywuggy-injector')) {
        console.warn('Code injector is already initialized.');
        return;
    }

    // Add gaming font and styles
    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        @keyframes borderAnimation {
            0%, 100% { border-image: linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080, #ff0000) 1; }
            25% { border-image: linear-gradient(180deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080, #ff0000) 1; }
            50% { border-image: linear-gradient(270deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080, #ff0000) 1; }
            75% { border-image: linear-gradient(360deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080, #ff0000) 1; }
        }

        .code-injector-button {
            padding: 5px 15px;
            border: none;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            font-family: 'Press Start 2P', cursive;
            font-size: 10px;
            margin: 5px;
        }

        .code-injector-input {
            width: 100%;
            padding: 5px;
            background-color: rgba(255, 255, 255, 0.15);
            border: none;
            border-radius: 4px;
            color: #fff;
            font-family: 'Press Start 2P', cursive;
            font-size: 10px;
            margin-bottom: 10px;
        }

        .code-injector-textarea {
            width: 100%;
            height: 200px;
            padding: 10px;
            background-color: rgba(30, 30, 30, 0.9);
            color: #fff;
            font-family: monospace;
            font-size: 12px;
            border: 1px solid #444;
            border-radius: 4px;
            resize: vertical;
            tab-size: 4;
        }

        .script-item {
            padding: 8px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .script-item:hover {
            background-color: rgba(255, 255, 255, 0.15);
        }
    `;
    document.head.appendChild(fontStyle);

    // Load saved scripts from localStorage
    const savedScripts = JSON.parse(localStorage.getItem('codeInjectorScripts')) || {};
    const activeScripts = JSON.parse(localStorage.getItem('codeInjectorActiveScripts')) || {};

    // Create main container
    const container = document.createElement('div');
    container.id = 'fluggywuggy-injector';
    container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 400px;
        min-height: 300px;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        color: #fff;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        display: none;
        z-index: 10000;
        font-family: 'Press Start 2P', cursive;
        font-size: 10px;
        border: 2px solid;
        animation: borderAnimation 2s linear infinite;
        resize: both;
        overflow: hidden;
        min-width: 300px;
        min-height: 200px;
    `;
    
    // Save window position and size in localStorage
    const savedPosition = JSON.parse(localStorage.getItem('injectorPosition')) || {};
    if (savedPosition.top) {
        container.style.top = savedPosition.top;
        container.style.left = savedPosition.left;
        container.style.width = savedPosition.width || '400px';
        container.style.height = savedPosition.height || '300px';
        container.style.transform = 'none';
    }

    // Create drag handle (title bar)
    const dragHandle = document.createElement('div');
    dragHandle.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 30px;
        cursor: move;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 8px 8px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
    `;

    // Add collapse button
    const collapseButton = document.createElement('button');
    collapseButton.textContent = '-';
    collapseButton.style.cssText = `
        background: none;
        border: 1px solid #fff;
        color: #fff;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Press Start 2P', cursive;
        font-size: 10px;
    `;

    // Add button container for future buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '5px';
    buttonContainer.appendChild(collapseButton);
    
    dragHandle.appendChild(title);
    dragHandle.appendChild(buttonContainer);
    container.appendChild(dragHandle);

    // Adjust container padding to account for drag handle
    container.style.paddingTop = '40px';

    // Move title to drag handle
    const title = document.createElement('div');
    title.textContent = "fluggywuggy's injector";
    title.style.fontWeight = 'bold';
    dragHandle.appendChild(title);

    // Add dragging functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    dragHandle.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        isDragging = true;
        initialX = e.clientX - container.offsetLeft;
        initialY = e.clientY - container.offsetTop;
        dragHandle.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // Ensure window stays within viewport bounds
            const maxX = window.innerWidth - container.offsetWidth;
            const maxY = window.innerHeight - container.offsetHeight;
            
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));

            container.style.left = currentX + 'px';
            container.style.top = currentY + 'px';
            container.style.transform = 'none';

            // Save position to localStorage
            localStorage.setItem('injectorPosition', JSON.stringify({
                top: container.style.top,
                left: container.style.left,
                width: container.style.width,
                height: container.style.height
            }));
        }
    }

    function dragEnd() {
        isDragging = false;
        dragHandle.style.cursor = 'move';
    }

    // Save size when window is resized
    const resizeObserver = new ResizeObserver(() => {
        if (container.style.display !== 'none') {
            localStorage.setItem('injectorPosition', JSON.stringify({
                top: container.style.top,
                left: container.style.left,
                width: container.style.width,
                height: container.style.height
            }));
        }
    });
    resizeObserver.observe(container);

    // Create script list container
    const scriptList = document.createElement('div');
    scriptList.style.maxHeight = '200px';
    scriptList.style.overflowY = 'auto';
    scriptList.style.marginBottom = '10px';
    container.appendChild(scriptList);

    // Create editor container (initially hidden)
    const editorContainer = document.createElement('div');
    editorContainer.style.display = 'none';
    
    // Create filename input
    const filenameInput = document.createElement('input');
    filenameInput.className = 'code-injector-input';
    filenameInput.placeholder = 'Enter filename...';
    editorContainer.appendChild(filenameInput);

    // Create code editor wrapper for proper resizing
    const codeEditorWrapper = document.createElement('div');
    codeEditorWrapper.style.cssText = `
        position: relative;
        width: 100%;
        height: calc(100% - 100px);
        min-height: 100px;
    `;
    
    const codeEditor = document.createElement('textarea');
    codeEditor.className = 'code-injector-textarea';
    codeEditor.placeholder = 'Enter your JavaScript code here...';
    codeEditor.style.cssText = `
        width: 100%;
        height: 100%;
        padding: 10px;
        background-color: rgba(30, 30, 30, 0.9);
        color: #fff;
        font-family: monospace;
        font-size: 12px;
        border: 1px solid #444;
        border-radius: 4px;
        resize: none;
        tab-size: 4;
    `;
    
    codeEditorWrapper.appendChild(codeEditor);
    editorContainer.appendChild(codeEditorWrapper);

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.marginTop = '10px';

    // Create buttons
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'code-injector-button';
    saveButton.style.backgroundColor = '#4CAF50';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'code-injector-button';
    cancelButton.style.backgroundColor = '#333';

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    editorContainer.appendChild(buttonContainer);

    container.appendChild(editorContainer);

    // Create "New Script" button
    const newScriptButton = document.createElement('button');
    newScriptButton.textContent = 'New Script';
    newScriptButton.className = 'code-injector-button';
    newScriptButton.style.backgroundColor = '#2196F3';
    newScriptButton.style.width = '100%';
    container.appendChild(newScriptButton);

    // Function to update script list
    function updateScriptList() {
        scriptList.innerHTML = '';
        Object.keys(savedScripts).forEach(filename => {
            const scriptItem = document.createElement('div');
            scriptItem.className = 'script-item';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = filename;
            scriptItem.appendChild(nameSpan);

            const controls = document.createElement('div');
            
            // Create checkbox for active state
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = activeScripts[filename] || false;
            checkbox.addEventListener('change', () => {
                activeScripts[filename] = checkbox.checked;
                localStorage.setItem('codeInjectorActiveScripts', JSON.stringify(activeScripts));
                if (checkbox.checked) {
                    try {
                        eval(savedScripts[filename]);
                    } catch (error) {
                        console.error(`Error executing ${filename}:`, error);
                    }
                }
            });
            controls.appendChild(checkbox);

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '×';
            deleteButton.className = 'code-injector-button';
            deleteButton.style.backgroundColor = '#f44336';
            deleteButton.style.padding = '2px 6px';
            deleteButton.style.marginLeft = '5px';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                delete savedScripts[filename];
                delete activeScripts[filename];
                localStorage.setItem('codeInjectorScripts', JSON.stringify(savedScripts));
                localStorage.setItem('codeInjectorActiveScripts', JSON.stringify(activeScripts));
                updateScriptList();
            });
            controls.appendChild(deleteButton);

            scriptItem.appendChild(controls);

            // Click to edit
            scriptItem.addEventListener('click', () => {
                filenameInput.value = filename;
                codeEditor.value = savedScripts[filename];
                scriptList.style.display = 'none';
                newScriptButton.style.display = 'none';
                editorContainer.style.display = 'block';
            });

            scriptList.appendChild(scriptItem);
        });
    }

    // Add basic code completion
    codeEditor.addEventListener('input', function() {
        const cursor = this.selectionStart;
        const text = this.value;
        const lastChar = text[cursor - 1];
        
        // Auto-complete brackets and quotes
        const pairs = {
            '(': ')',
            '{': '}',
            '[': ']',
            '"': '"',
            "'": "'",
            '`': '`'
        };

        if (pairs[lastChar]) {
            const completion = pairs[lastChar];
            this.value = text.slice(0, cursor) + completion + text.slice(cursor);
            this.selectionStart = cursor;
            this.selectionEnd = cursor;
        }

        // Simple keyword completion
        const keywords = ['function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while'];
        const lastWord = text.slice(0, cursor).match(/\w+$/);
        
        if (lastWord) {
            const matches = keywords.filter(k => k.startsWith(lastWord[0]));
            if (matches.length === 1) {
                const completion = matches[0].slice(lastWord[0].length);
                if (completion) {
                    this.value = text.slice(0, cursor) + completion + text.slice(cursor);
                    this.selectionStart = cursor;
                    this.selectionEnd = cursor + completion.length;
                }
            }
        }
    });

    // Button event listeners
    newScriptButton.addEventListener('click', () => {
        filenameInput.value = '';
        codeEditor.value = '';
        scriptList.style.display = 'none';
        newScriptButton.style.display = 'none';
        editorContainer.style.display = 'block';
    });

    saveButton.addEventListener('click', () => {
        const filename = filenameInput.value.trim();
        if (filename && codeEditor.value.trim()) {
            savedScripts[filename] = codeEditor.value;
            localStorage.setItem('codeInjectorScripts', JSON.stringify(savedScripts));
            scriptList.style.display = 'block';
            newScriptButton.style.display = 'block';
            editorContainer.style.display = 'none';
            updateScriptList();
        }
    });

    cancelButton.addEventListener('click', () => {
        scriptList.style.display = 'block';
        newScriptButton.style.display = 'block';
        editorContainer.style.display = 'none';
    });

    // Add to document
    document.body.appendChild(container);

    // Initialize script list
    updateScriptList();

    // Handle all keyboard events
    document.addEventListener('keydown', (e) => {
        // If container is visible, prevent all key events from propagating
        // unless we're in an input/textarea
        if (container.style.display === 'block') {
            const tag = e.target.tagName.toLowerCase();
            if (tag !== 'input' && tag !== 'textarea') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
        
        // Toggle visibility with 'P' key
        if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            const tag = e.target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') return;
            
            if (container.style.display === 'none') {
                container.style.display = 'block';
                updateScriptList();
            } else {
                container.style.display = 'none';
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // Also prevent keyup events from propagating
    document.addEventListener('keyup', (e) => {
        if (container.style.display === 'block') {
            const tag = e.target.tagName.toLowerCase();
            if (tag !== 'input' && tag !== 'textarea') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    });

    // Add collapse functionality
    let isCollapsed = false;
    const savedHeight = container.style.height;
    const savedContent = container.style.paddingTop;
    
    collapseButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent drag handling
        
        if (!isCollapsed) {
            // Collapse
            container.style.height = '30px';
            container.style.resize = 'none';
            container.style.paddingTop = '0';
            scriptList.style.display = 'none';
            newScriptButton.style.display = 'none';
            editorContainer.style.display = 'none';
            collapseButton.textContent = '+';
            
            // Create active scripts display
            const activeScriptsList = document.createElement('div');
            activeScriptsList.style.cssText = `
                display: flex;
                gap: 10px;
                padding: 5px 10px;
                overflow-x: auto;
                white-space: nowrap;
            `;
            
            Object.keys(activeScripts).forEach(filename => {
                if (activeScripts[filename]) {
                    const activeScript = document.createElement('span');
                    activeScript.textContent = filename;
                    activeScript.style.color = '#4CAF50';
                    activeScriptsList.appendChild(activeScript);
                }
            });
            
            container.appendChild(activeScriptsList);
        } else {
            // Expand
            container.style.height = savedHeight;
            container.style.resize = 'both';
            container.style.paddingTop = savedContent;
            scriptList.style.display = 'block';
            newScriptButton.style.display = 'block';
            if (editorContainer.childNodes.length) {
                editorContainer.style.display = 'block';
            }
            collapseButton.textContent = '-';
            
            // Remove active scripts display
            const activeScriptsList = container.querySelector('div:last-child');
            if (activeScriptsList !== newScriptButton) {
                container.removeChild(activeScriptsList);
            }
        }
        
        isCollapsed = !isCollapsed;
        
        // Prevent the click from triggering drag
        return false;
    });
})();
