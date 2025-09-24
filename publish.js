function setupGraphSettings() {
    if (app && app.graph && app.graph.renderer) {
        app.graph.renderer.hidePowerTag = true;
        console.log('Graph settings successfully applied.');
    } else {
        console.log('Graph renderer still not available, retrying in 10ms...');
        setTimeout(setupGraphSettings, 10); // Retry after 10ms
    }
}

// Initial call to setupGraphSettings
setupGraphSettings();