# Grade Analytics Dashboard 📊

A modern web application specifically designed for tracking and analyzing Swiss academic grades (scale 1-6) with a beautiful, responsive interface and dark mode support.

> **Note**: This is an active development version. More features are planned and will be added in future updates!

## Features ✨

- **Swiss Grade System**: Optimized for Swiss grading scale (1-6)
- **Grade Tracking**: Add and manage grades for different subjects
- **Visual Analytics**: View grade trends through interactive charts
- **Dark/Light Mode**: Toggle between dark and light themes
- **Persistent Storage**: Grades are saved in browser cookies
- **Custom Colors**: Personalize subject colors
- **Docker Support**: Easy deployment with Docker

## Upcoming Features 🚀

This project is actively being developed. Here are some features planned for future releases:

- 📊 Advanced statistics and grade predictions
- 💾 Data export/import functionality
- 📱 Progressive Web App (PWA) support
- 🔄 Cross-device synchronization
- 📈 More visualization options
- 🎯 Grade goals and tracking
- 📝 Notes and comments for grades

Stay tuned for updates! Feel free to suggest new features by creating an issue.

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

This project is licensed under the MIT License, making it free and open for everyone to use, modify, and distribute. You can:
- ✅ Use the software commercially
- ✅ Modify the source code
- ✅ Distribute the software
- ✅ Use and modify in private
- ✅ Use in a public project

The only requirement is to include the original license and copyright notice in any copy of the software/source.
