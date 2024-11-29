# Grade Analytics Dashboard 📊

A modern web application for tracking and analyzing academic grades with a beautiful, responsive interface and dark mode support.

## Features ✨

- **Grade Tracking**: Add and manage grades for different subjects
- **Visual Analytics**: View grade trends through interactive charts
- **Dark/Light Mode**: Toggle between dark and light themes
- **Persistent Storage**: Grades are saved in browser cookies
- **Responsive Design**: Works on desktop and mobile devices
- **Custom Colors**: Personalize subject colors
- **Docker Support**: Easy deployment with Docker

## Quick Start 🚀

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Grade_Analysis_App.git
   cd Grade_Analysis_App
   ```

2. Open `index.html` in your browser to run without Docker

### Running with Docker 🐳

1. Build and run using Docker Compose:
   ```bash
   docker compose up --build
   ```

2. Access the application at:
   ```
   http://localhost:3000
   ```

## Technology Stack 💻

- Frontend: HTML5, CSS3, JavaScript
- Charts: Chart.js
- Container: Docker & Nginx
- Storage: Browser Cookies

## Features in Detail 🔍

### Grade Management
- Add grades for different subjects
- Delete individual grades
- Clear all grades for a subject
- View grade averages and statistics

### Visual Analytics
- Interactive line chart showing grade progression
- Color-coded subject lines
- Responsive chart that updates in real-time

### Theme Support
- Toggle between dark and light modes
- Theme preference is saved
- Optimized colors for both themes

### Data Persistence
- Grades are saved in browser cookies
- Custom subject colors are preserved
- Theme preference is remembered

## Development 🛠️

### Project Structure
```
Grade_Analysis_App/
├── index.html          # Main HTML file
├── app.js             # Application logic
├── styles.css         # Styling
├── Dockerfile         # Docker configuration
├── compose.yml        # Docker Compose configuration
├── default.conf       # Nginx configuration
└── README.md          # Documentation
```

### Docker Configuration
The application can be containerized using Docker:
- Uses Nginx Alpine as base image
- Configured for both development and production
- Supports VPN connections through host network mode

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the LICENSE file for details.
