/**
 * Visibility Cycle Manager
 * Handles the visibility loop of the leaderboard table:
 * 1. Visible for 170 seconds
 * 2. Hides to left (5 minutes)
 * 3. Shows from left
 * 4. Repeats
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('table-container');

    if (!container) {
        console.error('VisibilityCycle: #table-container not found');
        return;
    }

    // Configuration
    const SHOW_TIME = 170 * 1000; // 170 seconds visible
    const HIDE_TIME = 300 * 1000; // 5 minutes hidden (300 seconds)

    // State management
    let isVisible = true;

    const hide = () => {
        // Remove show class if present
        container.classList.remove('slide-in');
        // Add hide class
        container.classList.add('slide-out');

        isVisible = false;

        // Schedule next show
        console.log(`[VisibilityCycle] Hiding table. Next show in ${HIDE_TIME / 1000}s`);
        setTimeout(show, HIDE_TIME);
    };

    const show = () => {
        // Remove hide class
        container.classList.remove('slide-out');
        // Add show class
        container.classList.add('slide-in');

        isVisible = true;

        // Schedule next hide
        console.log(`[VisibilityCycle] Showing table. Next hide in ${SHOW_TIME / 1000}s`);
        setTimeout(hide, SHOW_TIME);
    };

    // Start the cycle
    // Initial state is visible (static), so we wait SHOW_TIME before first hide.
    console.log(`[VisibilityCycle] Initialized. First hide in ${SHOW_TIME / 1000}s`);
    setTimeout(hide, SHOW_TIME);
});
