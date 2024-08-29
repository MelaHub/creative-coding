function loadPage(page) {
    const content = document.getElementById('content');

    const canvas = document.getElementsByTagName('canvas');
    for(let i = 0; i < canvas.length; i++) {
        canvas[i].remove();
    }
    
    if (page === 'home') {
        content.innerHTML = '<h1>Welcome!</h1><h2>Hopefully this page will be nicer and full of content soon!</h2>';
    } else if (page === 'skewed') {
        let canva = document.createElement('canvas');
        canva.setAttribute("id", "skewed-canvas"); 
        content.appendChild(canva);  
        loadScript('dist/skew.js');
    } else if (page === 'interactive-curve') {
        loadScript('dist/interactive-curve.js');
    } else if (page === 'curves') {
        loadScript('dist/curves.js');
    }
}

function loadScript(scriptName) {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const script = document.createElement('script');
    script.src = scriptName;
    
    content.appendChild(script);
}
