// Global Application State
const AppState = {
    currentUser: null,
    isAuthenticated: false,
    userData: {
        name: '',
        email: '',
        age: 25,
        weight: 70,
        height: 175,
        stepGoal: 10000,
        calorieGoal: 500,
        waterGoal: 8,
        totalSteps: 0,
        totalCalories: 0,
        totalWater: 0,
        currentStreak: 0,
        weeklySteps: [0, 0, 0, 0, 0, 0, 0],
        totalExerciseTime: 0,
        achievements: [],
        weeklyTotalSteps: 0,
        joinDate: new Date().toISOString()
    }
};

// Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('fitTracker_users')) || {};
        this.currentSession = JSON.parse(localStorage.getItem('fitTracker_session')) || null;
        this.initEventListeners();
        this.checkSession();
    }

    initEventListeners() {
        // Form toggle functionality
        document.getElementById('loginToggle').addEventListener('click', () => this.showLogin());
        document.getElementById('signupToggle').addEventListener('click', () => this.showSignup());
        
        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));
        
        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });

        // Forgot password
        document.getElementById('forgotPassword').addEventListener('click', (e) => this.handleForgotPassword(e));
    }

    showLogin() {
        document.getElementById('formWrapper').classList.remove('show-signup');
        document.getElementById('toggleSlider').classList.remove('signup');
        this.clearForms();
    }

    showSignup() {
        document.getElementById('formWrapper').classList.add('show-signup');
        document.getElementById('toggleSlider').classList.add('signup');
        this.clearForms();
    }

    clearForms() {
        document.querySelectorAll('.input-field').forEach(input => {
            input.value = '';
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        this.showLoading('loginLoading', true);

        // Simulate API call delay
        await this.delay(1500);

        // Check credentials
        const user = this.users[email];
        if (user && user.password === this.hashPassword(password)) {
            this.loginSuccess(user);
        } else {
            this.showNotification('Invalid credentials! Please try again.', 'error');
            this.showLoading('loginLoading', false);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const inputs = e.target.querySelectorAll('.input-field');
        const name = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        const confirmPassword = inputs[3].value;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match!', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        if (this.users[email]) {
            this.showNotification('Email already exists! Please login instead.', 'error');
            return;
        }

        this.showLoading('signupLoading', true);

        // Simulate API call delay
        await this.delay(2000);

        // Create new user
        const newUser = {
            name,
            email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            userData: { ...AppState.userData, name, email }
        };

        this.users[email] = newUser;
        this.saveUsers();
        
        this.signupSuccess(newUser);
    }

    loginSuccess(user) {
        this.showLoading('loginLoading', false);
        this.currentSession = { email: user.email, loginTime: new Date().toISOString() };
        this.saveSession();
        
        AppState.currentUser = user;
        AppState.isAuthenticated = true;
        AppState.userData = { ...AppState.userData, ...user.userData };
        
        this.showSuccessAnimation(() => {
            this.showNotification(`Welcome back, ${user.name}! 🎉`, 'success');
            this.switchToMainApp();
        });
    }

    signupSuccess(user) {
        this.showLoading('signupLoading', false);
        this.currentSession = { email: user.email, loginTime: new Date().toISOString() };
        this.saveSession();
        
        AppState.currentUser = user;
        AppState.isAuthenticated = true;
        AppState.userData = { ...AppState.userData, ...user.userData };
        
        this.showSuccessAnimation(() => {
            this.showNotification(`Account created successfully! Welcome to FitTracker Pro, ${user.name}! 🚀`, 'success');
            this.switchToMainApp();
        });
    }

    showSuccessAnimation(callback) {
        document.querySelector('.auth-container').classList.add('show-success');
        setTimeout(() => {
            callback();
        }, 1000);
    }

    switchToMainApp() {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        document.getElementById('userWelcome').textContent = `Welcome back, ${AppState.userData.name}! 🏆`;
        
        // Initialize main app
        fitTracker.init();
    }

    checkSession() {
        if (this.currentSession && this.users[this.currentSession.email]) {
            const user = this.users[this.currentSession.email];
            AppState.currentUser = user;
            AppState.isAuthenticated = true;
            AppState.userData = { ...AppState.userData, ...user.userData };
            this.switchToMainApp();
        }
    }

    logout() {
        this.currentSession = null;
        localStorage.removeItem('fitTracker_session');
        AppState.currentUser = null;
        AppState.isAuthenticated = false;
        
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('authContainer').style.display = 'flex';
        document.querySelector('.auth-container').classList.remove('show-success');
        
        this.clearForms();
        this.showLogin();
        this.showNotification('Logged out successfully! 👋', 'success');
    }

    handleSocialLogin(e) {
        const provider = e.target.className.includes('google') ? 'Google' : 
                       e.target.className.includes('facebook') ? 'Facebook' : 'Twitter';
        
        // Simulate social login
        this.showNotification(`${provider} login would be integrated here! 🚀`, 'success');
    }

    handleForgotPassword(e) {
        e.preventDefault();
        const email = prompt('Enter your email address:');
        if (email && this.users[email]) {
            this.showNotification('Password reset link sent to your email! 📧', 'success');
        } else if (email) {
            this.showNotification('Email not found in our records!', 'error');
        }
    }

    // Utility methods
    hashPassword(password) {
        // Simple hash for demo - use proper hashing in production
        return btoa(password + 'fitTracker_salt');
    }

    showLoading(elementId, show) {
        const loading = document.getElementById(elementId);
        const btnText = loading.parentElement.querySelector('.btn-text');
        
        if (show) {
            loading.style.display = 'block';
            btnText.style.display = 'none';
        } else {
            loading.style.display = 'none';
            btnText.style.display = 'block';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    saveUsers() {
        localStorage.setItem('fitTracker_users', JSON.stringify(this.users));
    }

    saveSession() {
        localStorage.setItem('fitTracker_session', JSON.stringify(this.currentSession));
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
}

// Enhanced Fitness Tracker Class
class FitnessTracker {
    constructor() {
        this.achievements = [
            { id: 'first_steps', name: 'First Steps', description: 'Log your first activity', icon: '🚶' },
            { id: 'hydration_hero', name: 'Hydration Hero', description: 'Drink 8 glasses of water', icon: '💧' },
            { id: '5k_steps', name: '5K Stepper', description: 'Walk 5,000 steps in a day', icon: '🎯' },
            { id: '10k_champion', name: '10K Champion', description: 'Walk 10,000 steps in a day', icon: '👑' },
            { id: 'calorie_crusher', name: 'Calorie Crusher', description: 'Burn 500+ calories in a day', icon: '🔥' },
            { id: 'hour_warrior', name: 'Hour Warrior', description: 'Exercise for 60+ minutes', icon: '⏰' },
            { id: 'week_streak', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '📅' },
            { id: 'hydration_master', name: 'Hydration Master', description: 'Perfect hydration for 5 days', icon: '🌊' }
        ];
    }

    init() {
        this.loadUserData();
        this.updateUI();
        this.setupAutoSave();
    }

    loadUserData() {
        const saved = localStorage.getItem(`fitTracker_userData_${AppState.currentUser.email}`);
        if (saved) {
            AppState.userData = { ...AppState.userData, ...JSON.parse(saved) };
        }
        this.populateInputs();
    }

    populateInputs() {
        document.getElementById('userName').value = AppState.userData.name;
        document.getElementById('userAge').value = AppState.userData.age;
        document.getElementById('userWeight').value = AppState.userData.weight;
        document.getElementById('userHeight').value = AppState.userData.height;
        document.getElementById('stepGoal').value = AppState.userData.stepGoal;
        document.getElementById('calorieGoal').value = AppState.userData.calorieGoal;
        document.getElementById('waterGoal').value = AppState.userData.waterGoal;
    }

    updateProfile() {
        AppState.userData.name = document.getElementById('userName').value || 'User';
        AppState.userData.age = parseInt(document.getElementById('userAge').value) || 25;
        AppState.userData.weight = parseInt(document.getElementById('userWeight').value) || 70;
        AppState.userData.height = parseInt(document.getElementById('userHeight').value) || 175;
        
        this.saveUserData();
        this.showNotification('Profile updated successfully! 👤', 'success');
    }

    setGoals() {
        AppState.userData.stepGoal = parseInt(document.getElementById('stepGoal').value) || 10000;
        AppState.userData.calorieGoal = parseInt(document.getElementById('calorieGoal').value) || 500;
        AppState.userData.waterGoal = parseInt(document.getElementById('waterGoal').value) || 8;
        
        this.updateProgress();
        this.saveUserData();
        this.showNotification('Goals updated successfully! 🎯', 'success');
    }

    logActivity() {
        const steps = parseInt(document.getElementById('stepCount').value) || 0;
        const activityType = document.getElementById('activityType').value;
        const duration = parseInt(document.getElementById('duration').value) || 0;
        const water = parseInt(document.getElementById('waterIntake').value) || 0;

        if (steps === 0 && duration === 0 && water === 0) {
            this.showNotification('Please enter at least one activity!', 'error');
            return;
        }

        // Update user data
        AppState.userData.totalSteps += steps;
        AppState.userData.totalWater += water;
        AppState.userData.totalExerciseTime += duration;
        
        // Calculate calories
        const caloriesPerMinute = this.getCaloriesPerMinute(activityType, AppState.userData.weight);
        const caloriesBurned = Math.round(caloriesPerMinute * duration);
        AppState.userData.totalCalories += caloriesBurned;

        // Update weekly steps
        AppState.userData.weeklySteps[6] += steps;
        AppState.userData.weeklyTotalSteps += steps;

        // Check achievements
        this.checkAchievements(steps, caloriesBurned, water, duration);
        
        // Update UI
        this.updateUI();
        this.clearActivityInputs();
        
        this.saveUserData();
        this.showNotification(`Activity logged! +${steps} steps, +${caloriesBurned} calories 🏃`, 'success');
    }

    simulateActivity() {
        const randomSteps = Math.floor(Math.random() * 8000) + 2000;
        const randomWater = Math.floor(Math.random() * 4) + 2;
        const randomDuration = Math.floor(Math.random() * 60) + 30;
        const randomCalories = Math.floor(Math.random() * 400) + 200;
        
        AppState.userData.totalSteps += randomSteps;
        AppState.userData.totalWater += randomWater;
        AppState.userData.totalCalories += randomCalories;
        AppState.userData.totalExerciseTime += randomDuration;
        AppState.userData.weeklySteps[6] += randomSteps;
        AppState.userData.weeklyTotalSteps += randomSteps;
        
        this.checkAchievements(randomSteps, randomCalories, randomWater, randomDuration);
        this.updateUI();
        this.saveUserData();
        
        this.showNotification(`Generated sample data: +${randomSteps} steps, +${randomCalories} calories! 🎲`, 'success');
    }

    quickLog(type, amount) {
        switch(type) {
            case 'steps':
                AppState.userData.totalSteps += amount;
                AppState.userData.weeklySteps[6] += amount;
                AppState.userData.weeklyTotalSteps += amount;
                break;
            case 'water':
                AppState.userData.totalWater += amount;
                break;
            case 'exercise':
                AppState.userData.totalExerciseTime += amount;
                const calories = Math.round(0.07 * AppState.userData.weight * amount);
                AppState.userData.totalCalories += calories;
                break;
        }

        this.updateUI();
        this.saveUserData();
        this.showNotification(`Quick logged: +${amount} ${type}! ⚡`, 'success');
    }

    resetDaily() {
        AppState.userData.totalSteps = 0;
        AppState.userData.totalCalories = 0;
        AppState.userData.totalWater = 0;
        AppState.userData.totalExerciseTime = 0;
        AppState.userData.weeklySteps[6] = 0;

        this.updateUI();
        this.saveUserData();
        this.showNotification('Daily progress reset! 🔄', 'success');
    }

    updateUI() {
        this.updateProgress();
        this.updateStats();
        this.updateAchievements();
    }

    updateProgress() {
        // Steps progress
        const stepsPercentage = Math.min((AppState.userData.totalSteps / AppState.userData.stepGoal) * 100, 100);
        document.getElementById('stepsProgress').style.width = stepsPercentage + '%';
        document.getElementById('stepsText').textContent = `${AppState.userData.totalSteps} / ${AppState.userData.stepGoal}`;

        // Calories progress
        const caloriesPercentage = Math.min((AppState.userData.totalCalories / AppState.userData.calorieGoal) * 100, 100);
        document.getElementById('caloriesProgress').style.width = caloriesPercentage + '%';
        document.getElementById('caloriesText').textContent = `${AppState.userData.totalCalories} / ${AppState.userData.calorieGoal}`;

        // Water progress
        const waterPercentage = Math.min((AppState.userData.totalWater / AppState.userData.waterGoal) * 100, 100);
        document.getElementById('waterProgress').style.width = waterPercentage + '%';
        document.getElementById('waterText').textContent = `${AppState.userData.totalWater} / ${AppState.userData.waterGoal}`;

        // Check for streak
        if (AppState.userData.totalSteps >= AppState.userData.stepGoal && 
            AppState.userData.totalCalories >= AppState.userData.calorieGoal && 
            AppState.userData.totalWater >= AppState.userData.waterGoal) {
            AppState.userData.currentStreak++;
        }
    }

    updateStats() {
        document.getElementById('totalSteps').textContent = AppState.userData.totalSteps.toLocaleString();
        document.getElementById('totalCalories').textContent = AppState.userData.totalCalories;
        document.getElementById('totalWater').textContent = AppState.userData.totalWater;
        document.getElementById('currentStreak').textContent = AppState.userData.currentStreak;
    }

    checkAchievements(steps, calories, water, duration) {
        const newAchievements = [];
        
        if (steps > 0 && !AppState.userData.achievements.includes('first_steps')) {
            newAchievements.push('first_steps');
        }
        
        if (steps >= 5000 && !AppState.userData.achievements.includes('5k_steps')) {
            newAchievements.push('5k_steps');
        }
        
        if (steps >= 10000 && !AppState.userData.achievements.includes('10k_champion')) {
            newAchievements.push('10k_champion');
        }
        
        if (water >= 8 && !AppState.userData.achievements.includes('hydration_hero')) {
            newAchievements.push('hydration_hero');
        }
        
        if (calories >= 500 && !AppState.userData.achievements.includes('calorie_crusher')) {
            newAchievements.push('calorie_crusher');
        }
        
        if (duration >= 60 && !AppState.userData.achievements.includes('hour_warrior')) {
            newAchievements.push('hour_warrior');
        }
        
        if (AppState.userData.currentStreak >= 7 && !AppState.userData.achievements.includes('week_streak')) {
            newAchievements.push('week_streak');
        }

        newAchievements.forEach(achievementId => {
            AppState.userData.achievements.push(achievementId);
            const achievement = this.achievements.find(a => a.id === achievementId);
            if (achievement) {
                setTimeout(() => {
                    this.showNotification(`🏆 Achievement Unlocked: ${achievement.name}!`, 'success');
                }, 500);
            }
        });

        if (newAchievements.length > 0) {
            this.updateAchievements();
        }
    }

    updateAchievements() {
        const achievementsContainer = document.getElementById('achievements');
        const recentAchievements = document.getElementById('recentAchievements');
        
        if (AppState.userData.achievements.length === 0) {
            achievementsContainer.innerHTML = `
                <div style="text-align: center; color: rgba(255, 255, 255, 0.7); padding: 20px;">
                    Start your fitness journey to unlock achievements!
                </div>
            `;
            return;
        }

        achievementsContainer.innerHTML = '';
        recentAchievements.innerHTML = '';
        
        AppState.userData.achievements.forEach(achievementId => {
            const achievement = this.achievements.find(a => a.id === achievementId);
            if (achievement) {
                const badge = document.createElement('div');
                badge.style.cssText = `
                    display: inline-block;
                    background: var(--success-gradient);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 25px;
                    margin: 5px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    box-shadow: var(--shadow-light);
                `;
                badge.textContent = `${achievement.icon} ${achievement.name}`;
                achievementsContainer.appendChild(badge);
                
                const listItem = document.createElement('li');
                listItem.textContent = `${achievement.name} - ${achievement.description}`;
                recentAchievements.appendChild(listItem);
            }
        });
    }

    clearActivityInputs() {
        document.getElementById('stepCount').value = '';
        document.getElementById('duration').value = '';
        document.getElementById('waterIntake').value = '';
    }

    getCaloriesPerMinute(activityType, weight) {
        const calorieRates = {
            walking: 0.05,
            running: 0.12,
            cycling: 0.08,
            swimming: 0.11,
            gym: 0.09,
            yoga: 0.03
        };
        return (calorieRates[activityType] || 0.05) * weight;
    }

    saveUserData() {
        localStorage.setItem(`fitTracker_userData_${AppState.currentUser.email}`, JSON.stringify(AppState.userData));
        
        // Also update user in auth system
        if (auth.users[AppState.currentUser.email]) {
            auth.users[AppState.currentUser.email].userData = AppState.userData;
            auth.saveUsers();
        }
    }

    setupAutoSave() {
        setInterval(() => {
            this.saveUserData();
        }, 30000); // Auto-save every 30 seconds
    }

    showNotification(message, type = 'success') {
        auth.showNotification(message, type);
    }
}

// Global Functions
function updateProfile() {
    fitTracker.updateProfile();
}

function setGoals() {
    fitTracker.setGoals();
}

function logActivity() {
    fitTracker.logActivity();
}

function simulateActivity() {
    fitTracker.simulateActivity();
}

function quickLog(type, amount) {
    fitTracker.quickLog(type, amount);
}

function resetDaily() {
    fitTracker.resetDaily();
}

function logout() {
    auth.logout();
}

// Initialize Application
const auth = new AuthSystem();
const fitTracker = new FitnessTracker();

// Welcome animation and tips
setTimeout(() => {
    if (!AppState.isAuthenticated) {
        auth.showNotification('💪 Ready to transform your life? Join thousands of users achieving their fitness goals!', 'success');
    }
}, 2000);

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add pulse effect to important buttons
    const importantButtons = document.querySelectorAll('.auth-btn, .app-btn');
    importantButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.classList.add('pulse');
        });
        btn.addEventListener('mouseleave', () => {
            btn.classList.remove('pulse');
        });
    });

    // Add floating animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

console.log('🚀 FitTracker Pro - Ultimate Fitness Experience Loaded!');
console.log('💪 Features: Authentication, Progress Tracking, Achievements, Responsive Design');
console.log('🔥 Ready to crush your fitness goals!');
