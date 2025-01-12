import GUI from 'lil-gui';

export function createVelocityDisplay() {
    const velocityDisplay = document.getElementById('velocity-display');
    
    return {
        update: (velocity) => {
            velocityDisplay.textContent = `{${velocity.x.toFixed(3)}, ${velocity.y.toFixed(3)}, ${velocity.z.toFixed(3)}}`;
        }
    };
}

export function createSimulationControls(onTimeScaleChange, onCChange) {
    const gui = new GUI();
    const controls = {
        timeScale: 1.0,
        c: 1.0,
    };

    gui.add(controls, 'timeScale', 0.01, 5.0)
       .onChange(onTimeScaleChange)
       .name('Time speed');

    // gui.add(controls, 'c', 1.0, 10.0)
    //    .onChange(onCChange)
    //    .name('C');

    return controls;
}
